import { AlertComponent } from './alert/alert.component';
import { InputComponent } from './input/input.component';
import { ModalComponent } from './modal/modal.component';
import { TabComponent } from './tab/tab.component';
import { TabsContainerComponent } from './tabs-container/tabs-container.component';
import { ClipsListComponent } from '../clips-list/clips-list.component';
// ✅ Exporta los componentes individuales
export { AlertComponent } from './alert/alert.component';
export { InputComponent } from './input/input.component';
export { ModalComponent } from './modal/modal.component';
export { TabComponent } from './tab/tab.component';
export { TabsContainerComponent } from './tabs-container/tabs-container.component';
export { ClipsListComponent } from '../clips-list/clips-list.component';

// ✅ Exporta el array
export const SharedUI = [
  AlertComponent,
  InputComponent,
  ModalComponent,
  TabComponent,
  TabsContainerComponent,
  ClipsListComponent,
] as const;
