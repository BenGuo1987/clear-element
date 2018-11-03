// 根据内存中的值来显示按钮
chrome.storage.sync.get(['action'], function(obj) {
  console.log(obj);
  if (obj.action === 'on') {
    showOnBtn($('#toggleBtn'));
  } else {
    showOffBtn($('#toggleBtn'));
  }
});

// ON/OFF button event
$('#toggleBtn').click(function() {
  const $this = $(this);
  let status = 'off';
  if ($this.hasClass('show-disable')) {
    showOnBtn($this);
    status = 'on';
    dynamicSetBrowserActionInfo({
      title: 'Clear Element is enable',
      iconPath: '../images/clear32.png',
      storageInfo: {action: 'on'}
    });
  } else {
    showOffBtn($this);
    status = 'off';
    dynamicSetBrowserActionInfo({
      title: 'Clear Element is disable',
      iconPath: '../images/disable_clear32.png',
      storageInfo: {action: 'off'}
    });
  }
  // 发送当前按钮的状态信息
  sendTabMessage({
    'status': status
  });
});

// theme icon event
$('.color-list').on('click', 'li', function() {
  const $this = $(this);
  // 发送当主题图标的样式信息
  sendTabMessage({
    'backgroundColor': $this.css('background-color'),
    'borderColor': $this.css('border-color')
  });
});

// 发送消息
const sendTabMessage = function(message) {
  chrome.tabs.query({
      active: true,
      currentWindow: true
    },
    function(tabs) {
      chrome.tabs.sendMessage(
        tabs[0].id,
        message,
        function(response) {
          console.log(response);
      });
   });
};

const showOnBtn = function($obj) {
  $obj.removeClass('show-disable');
  $obj.text('ON');
};

const showOffBtn = function($obj) {
  $obj.addClass('show-disable');
  $obj.text('OFF');
};

/**
 * 动态设置 Browser Action 相关信息
 * @param browserActionInfo (Object title, iconPath, storageInfo)
 **/
const dynamicSetBrowserActionInfo = function(browserActionInfo) {
  // 动态设置插件的tooltip
  chrome.browserAction.setTitle({
    title: browserActionInfo.title
  });
  // 动态设置ICON
  chrome.browserAction.setIcon({
    path: browserActionInfo.iconPath
  });
  chrome.storage.sync.set(browserActionInfo.storageInfo);
};
