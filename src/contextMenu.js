console.log('contextmenu')

chrome.runtime.onInstalled.addListener(function () {
  // Create a context menu item
  chrome.contextMenus.create({
    id: "autoCypressMenu",
    title: "Add test assertion",
    contexts: ["page", "selection", "link"]
  });
});

// Add an event listener to handle the click event
chrome.contextMenus.onClicked.addListener(function (info, tab) {
  if (info.menuItemId === "autoCypressMenu") {
    // Handle the context menu item click
    console.log("Context menu item clicked!");
    console.log(info); // Additional information about the context
    console.log(tab); // Information about the current tab
  }
});
