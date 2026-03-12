// Store
export { useTabsStore } from "./store";

// Components
export { TabBar } from "./components/tab-bar";

// Types & schemas
export {
  TabSchema,
  TabTypeSchema,
  TabIconSchema,
  TabStatusSchema,
  TabsPersistedStateSchema,
} from "./schemas/tab.schema";
export type {
  Tab,
  TabType,
  TabIcon,
  TabStatus,
  TabsPersistedState,
} from "./schemas/tab.schema";
