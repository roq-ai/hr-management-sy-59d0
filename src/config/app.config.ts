interface AppConfigInterface {
  ownerRoles: string[];
  customerRoles: string[];
  tenantRoles: string[];
  tenantName: string;
  applicationName: string;
  addOns: string[];
}
export const appConfig: AppConfigInterface = {
  ownerRoles: ['System Administrator'],
  customerRoles: [],
  tenantRoles: ['System Administrator', 'Team Lead', 'Academic Advisor', 'Data Analyst'],
  tenantName: 'Organization',
  applicationName: 'HR Management System',
  addOns: ['file upload', 'chat', 'notifications', 'file'],
};
