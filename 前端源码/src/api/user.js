// src/api/user.js

import axios from '~/axios';

export function uploadAvatar(data) {
  return axios.post('/admin/upload', data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
}

export function updateUserInfo(data) {
  return axios.post('/admin/updateuserinfo', data);
}
