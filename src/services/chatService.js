import { getAPI, patchAPI, postAPI } from '../utils/servicesUtil';

export const fetchChatMessages = async (postId, token) => {
  try {
    const response = await getAPI(`share-trip/chat-details?pb_id=${postId}`, token);
    return response;
  } catch (error) {
    console.error('Error fetching chat messages:', error);
    return { error: true, message: 'Failed to fetch messages' };
  }
};

export const sendChatMessage = async (data, token) => {
  
  try {
    const response = await postAPI('share-trip/chat-details', data, token);
    return response;
  } catch (error) {
    
    return { error: true, message: 'Failed to send message' };
  }
};

