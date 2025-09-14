import { connect } from "../../dbConfig/dbConfig";
import VisitorCounter from "../../models/visitor_counter.model";
import { InitialCounterValue } from "../types";
connect();
export const getVisitorCounter = async () => {
  let initialCounterValue: InitialCounterValue | null = { numberOfVisitor: 0 };
  try {
    initialCounterValue = await VisitorCounter.findOne(
      {},
      { numberOfVisitor: 1, _id: 0 }
    );
  } catch (e) {
    console.log(e);
  }

  return initialCounterValue?.numberOfVisitor || 0;
};

export const updateVisitorCounter = async () => {
  const options = {
    upsert: true, // Create the document if it doesn't exist
    setDefaultsOnInsert: true, // Apply schema defaults on insert
  };
  try {
    return await VisitorCounter.findOneAndUpdate(
      { numberOfVisitor: { $gte: 0 } },
      {
        $inc: { numberOfVisitor: 1 },
      },
      options
    );
  } catch (e) {
    console.error("error while updating counter: " + e?.message);
    console.error(e);
  }
};
