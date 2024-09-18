import { postAPI, postFormDataAPI } from "../utils/servicesUtil"



// export const createBusinessDetails = async (data, token, logo) => {
//    
  
//     const formData = new FormData();
//     formData.append('json', JSON.stringify(data)); // Make sure to stringify the JSON part
//     formData.append('businessLogo', logo);
  
//     const response = await postAPI('/share-trip/user-business', formData, token); // Pass formData
//   
//     return response;
//   };
export const createBusinessDetails = async (data, token, logo) => {
    

    // Create a FormData object and append the data
    const formData = new FormData();
    formData.append('json', JSON.stringify(data)); // Stringify the JSON part
    formData.append('businessLogo', logo); // Append the file

    // Pass formData to postFormDataAPI
    const response = await postFormDataAPI('/share-trip/user-business', formData, token);
    
    
    return response;
};