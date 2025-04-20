
const showNotification = (message, type = 'info') => {
    const notification = document.createElement('div');
    notification.className = `alert alert-${type} position-fixed top-0 start-50 translate-middle-x mt-3`;
    notification.style.zIndex = '1050';
    notification.innerText = message;
  
    document.body.appendChild(notification);
  
    setTimeout(() => {
      notification.remove();
    }, 4000);
  };
  
  const renderData = (data, containerId) => {
    const container = document.getElementById(containerId);
    container.innerHTML = '';
  
    data.forEach(item => {
      const row = document.createElement('tr');
      for (const key in item) {
        const td = document.createElement('td');
        td.textContent = item[key];
        row.appendChild(td);
      }
      container.appendChild(row);
    });
  };
  
  const updateTable = (data, containerId) => {
    renderData(data, containerId);
  };
  