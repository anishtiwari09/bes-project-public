import { IVisitorRegistration } from "@/app/backend/models/visitor_registration.model";
import mongoConnection from "../../db/db-config";
import VisitorServices from "../visitor-serives";
import UserAuthService from "../auth-service/user-auth-service";
import DelegateServices from "../delegate-services";
import MySpaceServices from "../my-space-srvices";

export default class AdminServices {
  private visitor: VisitorServices;
  private auth: UserAuthService;
  private delegate: DelegateServices;
  private mySpaces: MySpaceServices;
  constructor() {
    this.visitor = new VisitorServices();
    this.auth = new UserAuthService();
    this.delegate = new DelegateServices();
    this.mySpaces = new MySpaceServices();
  }

  async getAllVisitorDetails() {
    const isAmin = await this.auth.isAdmin();
    if (!isAmin) {
      return null;
    }
    return await this.visitor.allVisitors();
  }

  async getMySpaceRegistrations() {
    const isAmin = await this.auth.isAdmin();
    if (!isAmin) {
      return null;
    }
    return await this.mySpaces.getAllRegistrations();
  }
  async getAllDelegateUsers() {
    const isAmin = await this.auth.isAdmin();
    if (!isAmin) {
      return null;
    }
    return await this.delegate.allRegistrations();
  }
}
