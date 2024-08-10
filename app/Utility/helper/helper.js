const { DYNAMIC_LINK } = require("@/app/general/commonPath");

export const handleGetDynamicLink = (id) => {
  return DYNAMIC_LINK[id];
};
