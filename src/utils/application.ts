import { IApplication, IApplicationType } from '@/models';

/**
 * Get is application expired
 * @param application
 * @returns boolean
 */
export function isApplicationExpired(application: IApplication) {
  if (!application?.expired_at || application.expired_at === 'infinity') {
    return false; // vô hạn thì không expired
  }
  try {
    const expiredAt = new Date(application.expired_at);
    return expiredAt < new Date();
  } catch (error) {
    return false; // nếu lỗi parse date thì coi như không expired
  }
}

export function isApplicationExhausted(application: IApplication) {
  return false;
}

export function isApplicationUsable(application: IApplication) {
  const isExhausted = isApplicationExhausted(application);
  const isExpired = isApplicationExpired(application);
  console.debug('is application exhausted', isExhausted);
  console.debug('is application expired', isExpired);
  return !isExhausted && !isExpired;
}


/**
 * get final application from applications
 * @param applications
 * @returns application
 */
export function getFinalApplication(
  applications: IApplication[],
  currentApplication?: IApplication
): IApplication | undefined {
  if (currentApplication && isApplicationUsable(currentApplication)) {
    console.debug('current application is usable', currentApplication);
    return currentApplication;
  }
  console.debug('get final application from applications', applications);
  // check if there is any application with 'Period' type firstly, if yes, use it
  const application = applications?.find((application) => application?.type === IApplicationType.PERIOD);
  // else use the application with 'Usage' type
  const application2 = applications?.find((application) => application?.type === IApplicationType.USAGE);
  const finalApplication = application && isApplicationUsable(application) ? application : application2;
  console.debug('final application', finalApplication);
  return finalApplication;
}
