import { Store } from 'vuex'
import { getModule } from 'vuex-module-decorators'

import AuthModule from '~/store/auth'
import LandingModule from '~/store/landing'
import DialogModule from '~/store/dialog'
import AnnouncementsModule from '~/store/announcements'
import VisitStoreModule from '~/store/visitstore'
import QuestionnairesModule from '~/store/questionnaires'
import WelfareModule from '~/store/welfare'
import FunEventModule from '~/store/funevents'
import CommonModule from '~/store/common'
import GiftModule from '~/store/gift'
import PointModule from '~/store/point'
import ZendeskModule from '~/store/zendesk'

let authStore: AuthModule
let landingStore: LandingModule
let dialogStore: DialogModule
let announcementsStore: AnnouncementsModule
let visitStore: VisitStoreModule
let questionnairesStore: QuestionnairesModule
let welfareStore: WelfareModule
let funEventsStore: FunEventModule
let commonStore: CommonModule
let giftStore: GiftModule
let pointStore: PointModule
let zendeskStore: ZendeskModule

function initialiseStores(store: Store<any>): void {
  authStore = getModule(AuthModule, store)
  landingStore = getModule(LandingModule, store)
  dialogStore = getModule(DialogModule, store)
  announcementsStore = getModule(AnnouncementsModule, store)
  visitStore = getModule(VisitStoreModule, store)
  questionnairesStore = getModule(QuestionnairesModule, store)
  welfareStore = getModule(WelfareModule, store)
  funEventsStore = getModule(FunEventModule, store)
  commonStore = getModule(CommonModule, store)
  giftStore = getModule(GiftModule, store)
  pointStore = getModule(PointModule, store)
  zendeskStore = getModule(ZendeskModule, store)
}

export {
  initialiseStores,
  authStore,
  landingStore,
  dialogStore,
  announcementsStore,
  visitStore,
  questionnairesStore,
  welfareStore,
  funEventsStore,
  commonStore,
  giftStore,
  pointStore,
  zendeskStore
}
