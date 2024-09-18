


export const getIdByName = (data, name) => {
    const item = data.find((item) => item.v_name === name);
    return item ? item.id : null; 
  };
