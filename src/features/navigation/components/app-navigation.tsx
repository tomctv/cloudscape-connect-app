import { TopNavigation } from "@cloudscape-design/components";
import { LogOutIcon } from "@/components/icons/log-out";
import { UsersIcon } from "@/components/icons/users";
import { CalendarsIcon } from "@/components/icons/calendars";

export const AppNavigation: React.FC = () => {
  return (
    <div id="h" style={{ position: "sticky", top: 0, zIndex: 1002 }}>
      <TopNavigation
        identity={{
          href: "",
          title: "Connect+",
          logo: {
            src: "src/assets/app-logo-small.svg",
            alt: "Connect+",
          },
        }}
        utilities={[
          {
            type: "button",
            iconName: "search",
            text: "Search",
            ariaLabel: "Customer search",
            disableUtilityCollapse: true,
          },
          {
            type: "menu-dropdown",
            iconName: "grid-view",
            ariaLabel: "Actions",
            title: "Actions",
            items: [
              {
                id: "action-new-quote",
                text: "New quote",
                iconName: "add-plus",
                ariaLabel: "New quote",
              },
              {
                id: "action-new-quote-home",
                text: "New quote Home",
                iconName: "add-plus",
                ariaLabel: "New quote Home",
              },
              {
                id: "action-search-ivass-quote",
                text: "Search Ivass quote",
                iconName: "search",
                ariaLabel: "Search Ivass quote",
              },
              {
                id: "action-search-commission",
                text: "Search commission",
                iconName: "search",
                ariaLabel: "Search commission",
              },
            ],
          },
          {
            type: "menu-dropdown",
            iconSvg: <CalendarsIcon />,
            ariaLabel: "Calendars",
            title: "Calendars",
            description:
              "Manage your Outlook calendar and those of your coworkers.",
            items: [
              {
                id: "calendar-my",
                text: "My calendar",
                secondaryText: "View your personal calendar",
                iconName: "user-profile",
              },
              {
                id: "calendar-team",
                text: "Team calendar",
                secondaryText: "View your team's calendar",
                iconSvg: <UsersIcon />,
              },
            ],
          },
          {
            type: "menu-dropdown",
            text: "Username",
            description: "email@example.com",
            ariaLabel: "Manage profile",
            iconName: "user-profile",
            items: [
              {
                id: "role-group",
                text: "Role",
                ariaLabel: "Role selection",
                items: [
                  {
                    id: "role-admin",
                    text: "Admin",
                    ariaLabel: " Admin role",
                    iconName: "user-profile-active",
                    labelTag: "\u2713",
                    disabled: true,
                    disabledReason: "You are already using this role",
                    checked: true,
                  },
                  {
                    id: "role-team-leader",
                    text: "Team leader",
                    ariaLabel: " Team leader role",
                    iconName: "user-profile",
                  },
                  {
                    id: "role-consultant",
                    text: "Consultant",
                    ariaLabel: " Consultant role",
                    iconName: "user-profile",
                  },
                ],
              },
              { id: "preferences", text: "Preferences" },
              { id: "signout", text: "Sign out", iconSvg: <LogOutIcon /> },
            ],
          },
        ]}
      />
    </div>
  );
};
