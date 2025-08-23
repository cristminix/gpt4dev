export type SimulatedTab = { id: number; hostname: string }

export class TabManager {
  private tabs: SimulatedTab[] = []
  private nextTabId = 1
  private availableIds: number[] = [] // To keep track of closed tab IDs
  private storageKey = "simulatedTabs"

  constructor() {
    this.load()
  }

  private save() {
    localStorage.setItem(
      this.storageKey,
      JSON.stringify({
        tabs: this.tabs,
        nextTabId: this.nextTabId,
        availableIds: this.availableIds,
      })
    )
  }

  private load() {
    const data = localStorage.getItem(this.storageKey)
    if (data) {
      const parsed = JSON.parse(data)
      this.tabs = parsed.tabs || []
      this.nextTabId = parsed.nextTabId || 1
      this.availableIds = parsed.availableIds || []
    }
  }

  add(url: string): SimulatedTab {
    let tabId: number

    // Reuse an available ID if there is one
    if (this.availableIds.length > 0) {
      tabId = this.availableIds.pop()! // Get the last available ID
    } else {
      tabId = this.nextTabId++ // Otherwise, use the next available ID
    }

    const tab: SimulatedTab = {
      id: tabId,
      hostname: new URL(url).hostname,
    }
    this.tabs.push(tab)
    this.save()
    return tab
  }

  remove(id: number) {
    this.tabs = this.tabs.filter((t) => t.id !== id)
    this.availableIds.push(id) // Add the ID to available IDs for reuse
    this.save()
  }

  list(): SimulatedTab[] {
    return [...this.tabs]
  }
}

// // ---- usage ----
// const manager = new TabManager();

// // Adding tabs
// const tab1 = manager.add("https://google.com/");
// const tab2 = manager.add("https://google.com/");
// const tab3 = manager.add("https://example.com/");

// console.log("All tabs after adding:", manager.list());

// // Removing a tab
// manager.remove(tab1.id);
// console.log("All tabs after removing tab 1:", manager.list());

// // Adding a new tab, which should reuse the ID of the removed tab
// const tab4 = manager.add("https://newsite.com/");
// console.log("All tabs after adding a new tab:", manager.list());
