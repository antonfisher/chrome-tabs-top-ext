let initIcon;

function updateIcon(value) {
  value = Math.min(100, Math.max(0, value));
  initIcon = (initIcon || document.head.querySelector('link[rel*="icon"]'));
  if (initIcon) {
    initIcon.removeAttribute('rel');
  }
  const currentIcon = document.head.querySelector('link[rel*="icon"]');

  if (!currentIcon) {
    console.log('Cannot detect curent favicon');
  }

  const canvas = document.createElement('canvas');
  const newFavicon = document.createElement('img');
  const currentIconClone = initIcon.cloneNode(true);

  if (canvas.getContext) {
    const context = canvas.getContext('2d');

    newFavicon.onload = function () {
      canvas.width = this.width;
      canvas.height = this.height;

      const size = (this.width / 8);

      context.drawImage(this, 0, 0);

      context.lineWidth = '0';

      context.fillStyle = 'rgba(255, 255, 255, 0.5)';
      context.fillRect(0, 0, size * 2, this.height);

      context.fillStyle = 'rgba(255, 255, 255, 0.5)';
      context.fillRect(0, 0, size * 1.5, this.height);

      context.fillStyle = 'rgba(255, 255, 255, 1)';
      context.fillRect(0, 0, size, this.height);

      context.fillStyle = 'rgba(200, 0, 0, 1)';
      const height = (this.height * value / 100);
      context.fillRect(0, this.height - height, size, height);

      currentIconClone.href = canvas.toDataURL('image/png');
      currentIconClone.rel = 'icon';

      if (currentIcon) {
        document.head.removeChild(currentIcon);
      }
      document.head.appendChild(currentIconClone);
    };
    newFavicon.crossOrigin = 'Anonymous';
    newFavicon.src = initIcon.href;
  }
}

chrome.runtime.onMessage.addListener(({type, value}) => {
  if (type === 'UPDATE_CPU') {
    updateIcon(value);
  }
});
