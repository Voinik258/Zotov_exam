
const loadData = async (url, page = 1, limit = 10) => {
    try {
      const response = await fetch(`${url}?_page=${page}&_limit=${limit}`);
      return await response.json();
    } catch (error) {
      console.error('Ошибка загрузки данных:', error);
    }
  };
  
  const submitApplication = async (formData) => {
    try {
      const response = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      return await response.json();
    } catch (error) {
      console.error('Ошибка отправки заявки:', error);
    }
  };
  
  const editApplication = async (applicationId, formData) => {
    try {
      const response = await fetch(`/api/applications/${applicationId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      return await response.json();
    } catch (error) {
      console.error('Ошибка редактирования заявки:', error);
    }
  };
  
  const deleteApplication = async (applicationId) => {
    try {
      const response = await fetch(`/api/applications/${applicationId}`, {
        method: 'DELETE',
      });
      return await response.json();
    } catch (error) {
      console.error('Ошибка удаления заявки:', error);
    }
  };
  
  const searchTutors = async (filters) => {
    const queryString = new URLSearchParams(filters).toString();
    try {
      const response = await fetch(`/api/tutors?${queryString}`);
      return await response.json();
    } catch (error) {
      console.error('Ошибка поиска репетиторов:', error);
    }
  };
  