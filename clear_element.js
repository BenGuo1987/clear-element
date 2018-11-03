// clearElementInfo with default value
let clearElementInfo = {
  'status': 'off',
  'backgroundColor': 'rgba(239, 114, 103, 0.5)',
  'borderColor': '#ef7267'
};

// 根据内存中的值来更新clearElementInfo
chrome.storage.sync.get(['clearElementInfo'], function(obj) {
  if(obj.clearElementInfo) {
    updateClearElementInfo(obj.clearElementInfo);
  }
  initClearElement(clearElementInfo);
});


chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    console.log(request);

    updateClearElementInfo(request);

    initClearElement(clearElementInfo);

    chrome.storage.sync.set({
      'clearElementInfo': clearElementInfo
    });
});


function initClearElement(clearElementInfo) {
  if (clearElementInfo.status === 'on') {
    $('body *').off('click').on('click', function(e) {
      e.preventDefault();
    	e.stopPropagation();
    	var $this = $(this);
    	$this.removeClass('clear-element');
    	$('.clear-element-overlay').remove();
    	$this.addClass('clear-element').append('<div id="clearEleOverlay" class="clear-element-overlay"><div id="clearEleClose" class="clear-element-close">X</div></div>');

      console.log('....', clearElementInfo.backgroundColor);
      $('.clear-element-overlay').css({
        'background': clearElementInfo.backgroundColor,
        'border-color': clearElementInfo.borderColor
      });

      $('.clear-element-overlay').off('click').on('click', function(e) {
    		e.stopPropagation();
    		$('.clear-element').removeClass('clear-element');
    		$('.clear-element-overlay').remove();
    	})

    	$('.clear-element-close').off('click').on('click', function(e) {
        e.preventDefault();
    		e.stopPropagation();
    		$('.clear-element').remove();
    	})
    });
  } else if (clearElementInfo.status === 'off') {
    $('body *').off('click');
    $('.clear-element-overlay').remove();
  }
}

function updateClearElementInfo(sourceClearElementInfo) {
  if (sourceClearElementInfo.status)
    clearElementInfo.status = sourceClearElementInfo.status;
  if (sourceClearElementInfo.backgroundColor)
    clearElementInfo.backgroundColor = sourceClearElementInfo.backgroundColor;
  if (sourceClearElementInfo.borderColor)
    clearElementInfo.borderColor = sourceClearElementInfo.borderColor;
  return clearElementInfo;
}
