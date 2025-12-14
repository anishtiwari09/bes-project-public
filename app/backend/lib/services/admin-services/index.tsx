import { IVisitorRegistration } from "@/app/backend/models/visitor_registration.model";
import mongoConnection from "../../db/db-config";
import VisitorServices from "../visitor-serives";
import UserAuthService from "../auth-service/user-auth-service";

export default class AdminServices {
  private visitor: VisitorServices;
  private auth: UserAuthService;
  constructor() {
    this.visitor = new VisitorServices();
    this.auth = new UserAuthService();
  }

  async getAllVisitorDetails() {
    const isAmin = await this.auth.isAdmin();
    if (!isAmin) {
      return null;
    }
    return await this.visitor.allVisitors();
  }
}
