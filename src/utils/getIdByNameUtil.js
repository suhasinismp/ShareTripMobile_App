export const getIdByName = (data, name) => {
  const item = data?.find((item) => item.v_name === name);
  const nameId = item?.id || null;
  const typeId = item?.vehicle_types_id || null;
  return { nameId, typeId };
};
