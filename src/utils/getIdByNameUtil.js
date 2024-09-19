


export const getIdByName = (data, name) => {
    const item = data.find((item) => item.v_name === name);
    const nameId = item.id
    const typeId = item.vehicle_types_id
    return {nameId, typeId}
  };