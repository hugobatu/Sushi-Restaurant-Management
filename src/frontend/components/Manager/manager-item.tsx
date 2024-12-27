export type ManagerSideNavItem = {
  title: string;
  path: string;
  icon?: JSX.Element;
  submenu?: boolean;
  subMenuItems?: ManagerSideNavItem[];
};
