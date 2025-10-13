import { Component, AfterContentInit, ContentChildren, QueryList} from '@angular/core';
import { TabComponent } from '../tab/tab.component';
import { SharedCore } from '../shared-core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tabs-container',
  standalone: true,
  templateUrl: './tabs-container.component.html',
  styleUrls: ['./tabs-container.component.css'],
 imports: [SharedCore, CommonModule]
})
export class TabsContainerComponent implements AfterContentInit {

  @ContentChildren(TabComponent) tabs: QueryList<TabComponent> = new QueryList()

  constructor(){}

  ngAfterContentInit(): void {
  
    const activeTabs = this.tabs?.filter(
      tab => tab.active
    )

    if (!activeTabs || activeTabs.length === 0) {
      
      this.selectTab(this.tabs!.first)

    }

    
    }
  selectTab(tab: TabComponent) {

    this.tabs?.forEach(tab => {
      tab.active = false
    })
    tab.active = true
    return false
  }
  

}
