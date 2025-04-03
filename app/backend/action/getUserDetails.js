const { connect } = require("../dbConfig/dbConfig");
const {
  default: VisitorRegistration,
} = require("../models/visitor_registration.model");

connect();
export const getUserDetailFromUrn = async (urn) => {
  const data = await VisitorRegistration.findOne({
    unique_reference_number: urn,
  });
  if (!data) throw new Error("User not found");
  return data;
};
