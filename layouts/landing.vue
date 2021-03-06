<template>
  <div>
    <default-download-banner />
    <landing-header :logo-url="headerLogoUrl" :user="user" />
    <b-container fluid="xl">
      <b-row>
        <b-col>
          <div class="landingBanner">
            <landing-page-banner
              :items="bannerImages"
              @click="handleRedirect"
            />
          </div>
        </b-col>
      </b-row>
      <b-row>
        <b-col>
          <landing-page-app-carousel
            :icons="appCarouselIcons"
            @click="handleRedirect"
          />
        </b-col>
      </b-row>
    </b-container>
    <main class="landingBody">
      <b-container>
        <b-row>
          <b-col class="px-0 position-static">
            <nuxt />
          </b-col>
        </b-row>
      </b-container>
    </main>
    <landing-footer />
    <client-only>
      <default-dialog
        :active="dialogState"
        @confirm="handleDialogConfirm"
        @cancel="handleDialogClose"
        @accept="handleDialogClose"
        :message="dialogContent.message"
        :title="dialogContent.title"
        :type="dialogContent.type"
        :icon="dialogContent.icon"
      ></default-dialog>
    </client-only>
    <client-only>
      <default-mask :active="maskState" />
    </client-only>
    <client-only>
      <default-scroll-to-button />
    </client-only>
    <client-only>
      <default-modal
        :active="modalState"
        v-if="gifts.length"
        @click="handleModalClose"
      >
        <div class="gift">
          <div class="gift__title"></div>
          <div class="gift__banner"></div>
          <div class="gift__maintitle"></div>
          <div class="gift__content">{{ gifts[0].title }}</div>
          <div class="gift__footer"></div>
        </div>

        <div>
          <base-button
            type="primary"
            display="block"
            @click="handleGetGift(gifts[0].announcementSerialNo)"
          >
            立即領取
          </base-button>
        </div>
      </default-modal>
    </client-only>
    <client-only>
      <default-modal
        :active="adsModalState"
        v-if="latestAds !== null && !gifts.length"
        @click="handleAdsModalClose"
      >
        <div class="gift">
          <!-- <div class="gift__title"></div> -->
          <div
            class="gift__banner"
            :style="{ 'background-image': `url(${latestAds.fileurl})` }"
          ></div>
          <!-- <div class="gift__content">{{ latestAds.title }}</div> -->
        </div>
        <div>
          <base-button type="primary" display="block" @click="handleAdsClick">
            前往查看
          </base-button>
        </div>
      </default-modal>
    </client-only>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import { ProxyRequestObject, ResponseObject } from 'Http'
import { $axios } from '~/utils/api'
import LandingHeader from '~/components/LandingHeader.vue'
import LandingFooter from '~/components/LandingFooter.vue'
import LandingPageAppCarousel from '~/components/LandingPageAppCarousel.vue'
import LandingPageBanner from '~/components/LandingPageBanner.vue'
import DefaultDialog from '~/components/DefaultDialog.vue'
import DefaultMask from '~/components/DefaultMask.vue'
import DefaultScrollToButton from '~/components/DefaultScrollToButton.vue'
import DefaultDownloadBanner from '~/components/DefaultDownloadBanner.vue'

// import DefaultModal from '~/components/DefaultModal.vue'

import {
  landingStore,
  dialogStore,
  giftStore,
  authStore,
  commonStore
} from '~/store'

@Component({
  components: {
    DefaultDialog,
    LandingHeader,
    LandingFooter,
    LandingPageAppCarousel,
    LandingPageBanner,
    DefaultMask,
    DefaultScrollToButton,
    DefaultDownloadBanner,
    DefaultModal: () =>
      import(/* webpackPrefetch: true */ '~/components/DefaultModal.vue')
  }
})
export default class LandingLayout extends Vue {
  get user() {
    return authStore.user !== null ? authStore.user.accountid : ''
  }

  private handleClick(url: string) {
    window.open(url, '_blank')
  }

  get headerLogoUrl(): string {
    if (authStore.user !== null) {
      const mainGroupId = authStore.user.mainGroup
      return authStore.user.groups
        .filter((group: any) => group.groupid === mainGroupId)
        .reduce((prev: string, curr: any) => (prev += curr.profilelogo), '')
    }
    return ''
  }

  public timer: any = null

  get gifts() {
    return giftStore.notTakenOut
  }

  public modalState: boolean = false

  public handleModalClose() {
    dialogStore.setMaskActive(false)
    giftStore.setHasShowed(true)
    this.modalState = false
  }

  private adsModalState: boolean = false

  private handleAdsModalClose() {
    dialogStore.setMaskActive(false)
    this.adsModalState = false
  }

  private handleAdsClick() {
    if (this.latestAds !== null && this.latestAds.link !== '') {
      window.open(this.latestAds.link, '_blank')
    }
  }

  public async handleGetGift(serialno: string) {
    try {
      await this.sendClaimGiftRequest(serialno)
      giftStore.setHasShowed(true)
      dialogStore.setMaskActive(false)
      this.$router.push({
        name: 'announcements-serialno',
        params: { serialno }
      })
    } catch (e) {
      // error
    }
  }

  get pageData() {
    return landingStore.landingData
  }

  get appCarouselIcons() {
    if (landingStore.landingData) {
      const data: any = landingStore.landingData.find(
        (item: any) => item.title === 'hotStore'
      )
      if (data) {
        return data.data.map((item: any) => ({
          url: item.url,
          text: item.slogan || item.name,
          icon: item.webImageUrl,
          redirectHintMessage: item.redirectHintMessage,
          isDisplayHintMessage: item.isDisplayHintMessage
        }))
      }
      return []
    }
    return []
  }

  get bannerImages() {
    if (landingStore.landingData) {
      const data: any = landingStore.landingData.find(
        (item: any) => item.title === 'banner'
      )
      if (data) {
        const arr = [...data.data]
        const sortOrder = arr.sort(
          (a: any, b: any) => a.displayOrder - b.displayOrder
        )
        return sortOrder.map((item: any) => ({
          url: item.url,
          serialno: item.serialno,
          image: item.webImageUrl
        }))
      }
      return []
    }
    return []
  }

  get maskState() {
    return dialogStore.maskActive
  }

  get dialogState() {
    return dialogStore.active
  }

  get dialogContent() {
    return dialogStore.content
  }

  get latestAds() {
    return commonStore.ads
  }

  public handleDialogConfirm() {
    dialogStore.setConfirmed(true)
    dialogStore.setActive(false)
    dialogStore.setMaskActive(false)
    const { url } = dialogStore.confirmAction
    window.open(url, '_blank')
  }

  public handleDialogClose() {
    dialogStore.setActive(false)
    dialogStore.setMaskActive(false)
  }

  public handleRedirect({
    isDisplayHintMessage,
    redirectHintMessage,
    url
  }: any) {
    if (isDisplayHintMessage) {
      dialogStore.setActive(true)
      dialogStore.setMaskActive(true)
      dialogStore.setContent({
        title: '您即將前往第三方合作網站，是否繼續？',
        message: redirectHintMessage,
        type: 'confirm'
      })
      dialogStore.setConfirmAction({ url })
    } else if (url !== '') {
      window.open(url, '_blank')
    }
  }

  public async sendClaimGiftRequest(serialno: string) {
    const requestBody: ProxyRequestObject = {
      endpoint: '/api/GiftActivity/notTakenOuts',
      key: process.env.apiKey,
      data: { AnnouncementSerialNo: serialno },
      method: 'post',
      token: this.$cookies.get('accessToken')
    }
    try {
      const result: ResponseObject = await $axios.post('/api', requestBody)
      switch (Number(result.data.syscode)) {
        case 200:
          return result.data.data
        case 404:
          throw new Error('Failed to update status for this gift')
        default:
          return null
      }
    } catch (e) {
      throw new Error(`Backend Error: ${e}`)
    }
  }

  public async sendGetGiftRequest() {
    try {
      await giftStore.getNotTakenOut({
        token: this.$cookies.get('accessToken')
      })
    } catch (e) {
      //  error
    }
  }

  private async sendGetLatestAds() {
    try {
      await commonStore.getLatestAds({
        token: this.$cookies.get('accessToken')
      })
    } catch (e) {
      //  error
    }
  }

  public async mounted() {
    if (!giftStore.hasShowed) {
      this.timer = setTimeout(async () => {
        await this.sendGetGiftRequest()
        if (this.gifts.length) {
          dialogStore.setMaskActive(true)
          this.modalState = true
        }
      }, 3000)
    }
    await this.sendGetLatestAds()
    if (this.latestAds !== null) {
      dialogStore.setMaskActive(true)
      this.adsModalState = true
    }
  }

  public beforeDestroyed() {
    clearTimeout(this.timer)
  }
}
</script>

<style lang="scss" scoped>
@import '../assets/scss/utils/variables';

.landingBody {
  background-color: $whiteFour;
}
.landingBanner {
  margin-top: 52px;
}
</style>
