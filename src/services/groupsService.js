import {
  deleteAPI,
  getAPI,
  patchAPI,
  patchFormDataAPI,
  postFormDataAPI,
} from '../utils/servicesUtil';

// export const getGroups = async (token) => {
//   const response = await getAPI('share-trip/groups', token);
//   return response;
// };

export const getGroupListUserId = async (userId, token) => {

  const response = await getAPI(`share-trip/group-users/group-list-userId/${userId}`, token);
  console.log('ddd', response)
  return response;
}

export const createGroup = async (data, token) => {
  const response = await postFormDataAPI('share-trip/groups', data, token);
  return response;
};

export const getGroupRequestByUserId = async (userId, token) => {

  const response = await getAPI(
    `share-trip/group-users-invite/request-data/${userId}`,
    token,
  );

  return response;
};
export const groupAcceptInvite = async (token, group_Id, user_Id) => {
  const response = await patchAPI({
    endUrl: `share-trip/group-users-invite/accept-invitation?user_id=${user_Id}&group_id=${group_Id}`,
    token: token,
  });

  return response;
};

export const updateUserAdminStatus = async (data, token) => {
  console.log({ data, token }); // Add this log statement to check the data being sent t
  const response = await patchAPI({
    endUrl: 'share-trip/group-users',
    body: data,
    token: token,
  });
  console.log('fff', response)
  return response;
};

export const groupDeclineInvite = async (token, group_Id, user_Id) => {
  const response = await patchAPI({
    endUrl: `share-trip/group-users-invite/decline-invitation?user_id=${user_Id}&group_id=${group_Id}`,
    token: token,
  });
  return response;
};

export const getGroupUserDetailsById = async (groupId, token) => {
  const response = await getAPI(`share-trip/group-users/${groupId}`, token);
  return response;
};

export const deleteGroup = async (groupId, token) => {
  const response = await deleteAPI({
    endUrl: `share-trip/groups?groups_id=${groupId}`,
    token: token,
  });
  console.log('aish', response)
  return response;
};

export const exitGroup = async (userId, groupId, token) => {
  const response = await deleteAPI({
    endUrl: `share-trip/group-users/self-exit?user_id=${userId}&group_id=${groupId}`,
    token: token,
  });
  return response;
};
export const deleteGroupUser = async (token, userId, groupId) => {
  console.log({ token, userId, groupId });
  const response = await deleteAPI({
    // endUrl: `share-trip/group-users?user_id=${userId}&group_id=${groupId}`,
    endUrl: `/share-trip/group-users/delete-user?user_id=${userId}&group_id=${groupId}`,
    token: token,

  });
  console.log('ddd', response);
  return response;
};

export const updateGroup = async (payload, token) => {
  const response = await patchFormDataAPI({
    endUrl: 'share-trip/groups',
    formData: payload,
    token: token,
  });
  return response;
};
