// API service for backend communication
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

class ApiService {
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const token = localStorage.getItem('adminToken');

    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        // If unauthorized, clear token and redirect
        if (response.status === 401) {
          localStorage.removeItem('adminToken');
          localStorage.removeItem('adminEmail');
          localStorage.removeItem('adminLoginTime');
          if (window.location.pathname.startsWith('/admin')) {
            window.location.href = '/adminLogin';
          }
        }
        throw new Error(data.error || 'Request failed');
      }

      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // Members API
  async getMembers() {
    return this.request('/members');
  }

  async getMember(id) {
    return this.request(`/members/${id}`);
  }

  async createMember(memberData) {
    return this.request('/members', {
      method: 'POST',
      body: JSON.stringify(memberData),
    });
  }

  async updateMember(id, memberData) {
    return this.request(`/members/${id}`, {
      method: 'PUT',
      body: JSON.stringify(memberData),
    });
  }

  async deleteMember(id) {
    return this.request(`/members/${id}`, {
      method: 'DELETE',
    });
  }

  // Positions API
  async getPositions() {
    return this.request('/positions');
  }

  async createPosition(name) {
    return this.request('/positions', {
      method: 'POST',
      body: JSON.stringify({ name }),
    });
  }

  async updatePosition(id, name) {
    return this.request(`/positions/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ name }),
    });
  }

  async deletePosition(id) {
    return this.request(`/positions/${id}`, {
      method: 'DELETE',
    });
  }

  // Events API
  async getEvents() {
    return this.request('/events');
  }

  async getEvent(id) {
    return this.request(`/events/${id}`);
  }

  async createEvent(eventData) {
    return this.request('/events', {
      method: 'POST',
      body: JSON.stringify(eventData),
    });
  }

  async updateEvent(id, eventData) {
    return this.request(`/events/${id}`, {
      method: 'PUT',
      body: JSON.stringify(eventData),
    });
  }

  async deleteEvent(id) {
    return this.request(`/events/${id}`, {
      method: 'DELETE',
    });
  }

  // Projects API
  async getProjects(featured = false) {
    const params = featured ? '?featured=true' : '';
    return this.request(`/projects${params}`);
  }

  async getProject(id) {
    return this.request(`/projects/${id}`);
  }

  async createProject(projectData) {
    return this.request('/projects', {
      method: 'POST',
      body: JSON.stringify(projectData),
    });
  }

  async updateProject(id, projectData) {
    return this.request(`/projects/${id}`, {
      method: 'PUT',
      body: JSON.stringify(projectData),
    });
  }

  async deleteProject(id) {
    return this.request(`/projects/${id}`, {
      method: 'DELETE',
    });
  }

  // Upload API
  async uploadImage(file, folder = 'ethical-hck') {
    const url = `${API_BASE_URL}/upload/image`;
    const token = localStorage.getItem('adminToken');

    const formData = new FormData();
    formData.append('image', file);
    formData.append('folder', folder);

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      if (response.status === 401) {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminEmail');
        localStorage.removeItem('adminLoginTime');
        if (window.location.pathname.startsWith('/admin')) {
          window.location.href = '/adminLogin';
        }
      }
      throw new Error(data.error || 'Upload failed');
    }

    return data;
  }

  async uploadImages(files, folder = 'ethical-hck/gallery') {
    const url = `${API_BASE_URL}/upload/images`;
    const token = localStorage.getItem('adminToken');

    const formData = new FormData();
    files.forEach(file => {
      formData.append('images', file);
    });
    formData.append('folder', folder);

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      if (response.status === 401) {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminEmail');
        localStorage.removeItem('adminLoginTime');
        if (window.location.pathname.startsWith('/admin')) {
          window.location.href = '/adminLogin';
        }
      }
      throw new Error(data.error || 'Upload failed');
    }

    return data;
  }
}

export default new ApiService();

