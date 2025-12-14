import { IVisitorRegistration } from "@/app/backend/models/visitor_registration.model";
import mongoConnection from "../../db/db-config";
import VisitorServices from "../visitor-serives";
import UserAuthService from "../auth-service/user-auth-service";
import DelegateServices from "../delegate-services";

export default class AdminServices {
  private visitor: VisitorServices;
  private auth: UserAuthService;
  private delegate: DelegateServices;
  constructor() {
    this.visitor = new VisitorServices();
    this.auth = new UserAuthService();
    this.delegate = new DelegateServices();
  }

  async getAllVisitorDetails() {
    const isAmin = await this.auth.isAdmin();
    if (!isAmin) {
      return null;
    }
    return await this.visitor.allVisitors();
  }
  async getAllDelegateUsers() {
    const isAmin = await this.auth.isAdmin();
    if (!isAmin) {
      return null;
    }
    return await this.delegate.allRegistrations();
  }
}
