const FollowRequestStatusEnum = {
  PENDING: "pending",
  ACCEPTED: "accespted",
  REJECTED: "rejected",
};

const AvailableFollowRequestStatus = Object.values(FollowRequestStatusEnum);

const UserRolesEnum = {
  USER: "user",
  ADMIN: "admin",
  DEVELOPER: "developer",
  TESTER: "tester",
};

const AvailableUserRoles = Object.values(UserRolesEnum);

export {
  FollowRequestStatusEnum,
  AvailableFollowRequestStatus,
  UserRolesEnum,
  AvailableUserRoles,
};
