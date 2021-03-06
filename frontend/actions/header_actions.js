export const RECEIVE_NEW_HEADER_TYPE = 'RECEIVE_CURRENT_HEADER_TYPE';

export const receiveNewHeaderType = (headerType, tooltip = false) => {
  return {
    type: RECEIVE_NEW_HEADER_TYPE,
    headerType,
    tooltip,
  };
};
