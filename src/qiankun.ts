interface QiankunWindow extends Window {
  __POWERED_BY_QIANKUN__?: boolean;
}

export const isQiankun = (window as QiankunWindow).__POWERED_BY_QIANKUN__;
