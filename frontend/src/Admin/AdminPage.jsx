import React, { useState, useEffect } from "react";
import axios from "axios";
import "./AdminPage.css";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title, PointElement, LineElement } from 'chart.js';
import { Pie, Bar, Line } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(
  ArcElement, 
  Tooltip, 
  Legend, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title, 
  PointElement, 
  LineElement
);

function AdminPage() {
  const [selectedSection, setSelectedSection] = useState("dashboard");
  const [users, setUsers] = useState([]);
  const [providers, setProviders] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [loadingProviders, setLoadingProviders] = useState(false);
  const [errorUsers, setErrorUsers] = useState(null);
  const [errorProviders, setErrorProviders] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      if (selectedSection === "users") {
        setLoadingUsers(true);
        setErrorUsers(null);
        try {
          let config = {
            method: "get",
            maxBodyLength: Infinity,
            url: import.meta.env.VITE_APP_BACKEND+"/customer/auth/bulkcustomer",
            headers: {
              Authorization: `bearer ${localStorage.getItem("customerToken")}`,
            },
          };
          const response = await axios.request(config);
          console.log(response?.data?.customers);
          if (response.status !== 200) {
            throw new Error("Failed to fetch users");
          }
          setUsers(response?.data?.customers);
          console.log(response?.data?.customers);
          
        } catch (error) {
          setErrorUsers("Failed to fetch users: " + error.message);
        } finally {
          setLoadingUsers(false);
        }
      }
    };

    const fetchProviders = async () => {
      if (selectedSection === "providers") {
        setLoadingProviders(true);
        setErrorProviders(null);
        try {
          let config = {
            method: "get",
            maxBodyLength: Infinity,
            url: import.meta.env.VITE_APP_BACKEND+"/customer/auth/bulkprovider",
            headers: {
              Authorization: `bearer ${localStorage.getItem("customerToken")}`,
            },
          };
          const response = await axios.request(config);
          if (response.status !== 200) {
            throw new Error("Failed to fetch providers");
          }
          setProviders(response?.data?.provider);
          console.log(response?.data?.provider);
          
        } catch (error) {
          setErrorProviders("Failed to fetch providers: " + error.message);
        } finally {
          setLoadingProviders(false);
        }
      }
    };

    fetchUsers();
    fetchProviders();
  }, [selectedSection]);

  // Delete user function
  const handleDeleteUser = async (customerId) => {
    if (!window.confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
      return;
    }

    setDeleteLoading(`user-${customerId}`);
    try {
      const token = localStorage.getItem("customerToken");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await axios.delete(
        `${import.meta.env.VITE_APP_BACKEND}/customer/auth/deletecustomer/${customerId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Changed from 'bearer' to 'Bearer'
            'Content-Type': 'application/json',
          },
        }
      );
      
      if (response.status === 200) {
        // Remove user from local state
        setUsers(prevUsers => prevUsers.filter(user => user.customerId !== customerId));
        alert("User deleted successfully!");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      
      // More detailed error handling
      if (error.response) {
        // Server responded with error status
        const errorMessage = error.response.data?.error || error.response.data?.message || 'Server error';
        alert(`Error deleting user: ${errorMessage}`);
      } else if (error.request) {
        // Request was made but no response received
        alert("Network error: Unable to connect to server");
      } else {
        // Something else happened
        alert(`Error: ${error.message}`);
      }
    } finally {
      setDeleteLoading(null);
    }
  };

  // Delete provider function
  const handleDeleteProvider = async (providerId) => {
    if (!window.confirm("Are you sure you want to delete this provider? This action cannot be undone.")) {
      return;
    }

    setDeleteLoading(`provider-${providerId}`);
    try {
      const token = localStorage.getItem("customerToken");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await axios.delete(
        `${import.meta.env.VITE_APP_BACKEND}/provider/auth/deleteprovider/${providerId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Changed from 'bearer' to 'Bearer'
            'Content-Type': 'application/json',
          },
        }
      );
      
      if (response.status === 200) {
        // Remove provider from local state
        setProviders(prevProviders => prevProviders.filter(provider => provider.providerId !== providerId));
        alert("Provider deleted successfully!");
      }
    } catch (error) {
      console.error("Error deleting provider:", error);
      
      // More detailed error handling
      if (error.response) {
        // Server responded with error status
        const errorMessage = error.response.data?.error || error.response.data?.message || 'Server error';
        alert(`Error deleting provider: ${errorMessage}`);
      } else if (error.request) {
        // Request was made but no response received
        alert("Network error: Unable to connect to server");
      } else {
        // Something else happened
        alert(`Error: ${error.message}`);
      }
    } finally {
      setDeleteLoading(null);
    }
  };

  const renderUsersTable = () => {
    if (loadingUsers) return <div>Loading users...</div>;
    if (errorUsers) return <div className="error">{errorUsers}</div>;
    if (!users || users.length === 0) return <div>No users found.</div>;
    
    return (
      <div className="table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Address</th>
              <th>Join Date</th>
              <th>Total Orders</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.customerId}>
                <td data-label="ID">#{user.customerId}</td>
                <td data-label="Name">{user?.customerName || user.fullName || user.username}</td>
                <td data-label="Email">{user.customerEmail}</td>
                <td data-label="Phone">{user.customerPhone || user.mobile}</td>
                <td data-label="Address">{user.customerAddress || 'Address not available'}</td>
                <td data-label="Join Date">
                  {user.customerCreatedAt ? new Date(user.customerCreatedAt).toLocaleDateString() : 'N/A'}
                </td>
                <td data-label="Total Orders">
                  <span className="badge badge-info">{user.totalOrders || 0}</span>
                </td>
                <td data-label="Actions">
                  <div className="action-buttons">
                    <button 
                      className="btn-view" 
                      title="View Details"
                      onClick={() => alert('View functionality to be implemented')}
                    >
                      👁️
                    </button>
                    <button 
                      className="btn-edit" 
                      title="Edit User"
                      onClick={() => alert('Edit functionality to be implemented')}
                    >
                      ✏️
                    </button>
                    <button 
                      className="btn-delete" 
                      title="Delete User"
                      onClick={() => handleDeleteUser(user.customerId)}
                      disabled={deleteLoading === `user-${user.customerId}`}
                    >
                      {deleteLoading === `user-${user.customerId}` ? '⏳' : '🗑️'}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const renderProvidersTable = () => {
    if (loadingProviders) return <div>Loading providers...</div>;
    if (errorProviders) return <div className="error">{errorProviders}</div>;
    if (!providers || providers.length === 0) return <div>No providers found.</div>;
    
    return (
      <div className="table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Service</th>
              <th>Address</th>
              <th>Rating</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {providers.map((provider) => (
              <tr key={provider.providerId}>
                <td data-label="ID">#{provider.providerId}</td>
                <td data-label="Name">{provider.providerName || provider.providerfullName || provider.providerusername}</td>
                <td data-label="Email">{provider.providerEmail}</td>
                <td data-label="Phone">{provider.providerPhone || provider.mobile}</td>
                <td data-label="Service">
                  <span className="service-badge">{provider.providerWorkType || provider.service}</span>
                </td>
                <td data-label="Address">{provider.providerAddress || 'Address not available'}</td>
                <td data-label="Rating">
                  <div className="rating">
                    <span>★</span> {provider.providerRating ? provider.providerRating.toFixed(1) : 'N/A'}
                  </div>
                </td>
                <td data-label="Status">
                  <span className={`status ${provider.providerStatus ? 'active' : 'inactive'}`}>
                    {provider.providerStatus ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td data-label="Actions">
                  <div className="action-buttons">
                    <button 
                      className="btn-view" 
                      title="View Details"
                      onClick={() => alert('View functionality to be implemented')}
                    >
                      👁️
                    </button>
                    <button 
                      className="btn-edit" 
                      title="Edit Provider"
                      onClick={() => alert('Edit functionality to be implemented')}
                    >
                      ✏️
                    </button>
                    <button 
                      className="btn-delete" 
                      title="Delete Provider"
                      onClick={() => handleDeleteProvider(provider.providerId)}
                      disabled={deleteLoading === `provider-${provider.providerId}`}
                    >
                      {deleteLoading === `provider-${provider.providerId}` ? '⏳' : '🗑️'}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  // Helper functions for chart data
  const calculateUserGenderData = () => {
    if (!users.length) return { labels: ['No Data'], datasets: [{ data: [1], backgroundColor: ['#e5e7eb'] }] };
    
    const genderCounts = users.reduce((acc, user) => {
      const gender = user.customerGender || 'Unspecified';
      acc[gender] = (acc[gender] || 0) + 1;
      return acc;
    }, {});
    
    return {
      labels: Object.keys(genderCounts),
      datasets: [
        {
          data: Object.values(genderCounts),
          backgroundColor: [
            'rgba(54, 162, 235, 0.8)',
            'rgba(255, 99, 132, 0.8)',
            'rgba(255, 206, 86, 0.8)',
          ],
          borderColor: [
            'rgba(54, 162, 235, 1)',
            'rgba(255, 99, 132, 1)',
            'rgba(255, 206, 86, 1)',
          ],
          borderWidth: 1,
        },
      ],
    };
  };

  const calculateProviderServiceData = () => {
    if (!providers.length) return { labels: ['No Data'], datasets: [{ data: [1], backgroundColor: ['#e5e7eb'] }] };
    
    const serviceCounts = providers.reduce((acc, provider) => {
      const service = provider.providerWorkType || 'Unspecified';
      acc[service] = (acc[service] || 0) + 1;
      return acc;
    }, {});
    
    const serviceColors = {
      'Plumber': 'rgba(54, 162, 235, 0.8)',
      'Electrician': 'rgba(255, 206, 86, 0.8)',
      'Carpenter': 'rgba(75, 192, 192, 0.8)',
      'Unspecified': 'rgba(201, 203, 207, 0.8)'
    };
    
    return {
      labels: Object.keys(serviceCounts),
      datasets: [
        {
          data: Object.values(serviceCounts),
          backgroundColor: Object.keys(serviceCounts).map(service => serviceColors[service] || 'rgba(153, 102, 255, 0.8)'),
          borderColor: Object.keys(serviceCounts).map(service => 
            serviceColors[service]?.replace('0.8', '1') || 'rgba(153, 102, 255, 1)'
          ),
          borderWidth: 1,
        },
      ],
    };
  };

  const calculateProviderStatusData = () => {
    if (!providers.length) return { labels: ['No Data'], datasets: [{ data: [1], backgroundColor: ['#e5e7eb'] }] };
    
    const activeCount = providers.filter(provider => provider.providerStatus).length;
    const inactiveCount = providers.length - activeCount;
    
    return {
      labels: ['Active', 'Inactive'],
      datasets: [
        {
          data: [activeCount, inactiveCount],
          backgroundColor: [
            'rgba(16, 185, 129, 0.8)',
            'rgba(239, 68, 68, 0.8)',
          ],
          borderColor: [
            'rgba(16, 185, 129, 1)',
            'rgba(239, 68, 68, 1)',
          ],
          borderWidth: 1,
        },
      ],
    };
  };

  const calculateCustomerOrdersData = () => {
    if (!users.length) return { 
      labels: ['No Data'], 
      datasets: [
        { 
          label: 'Orders',
          data: [0],
          backgroundColor: 'rgba(75, 192, 192, 0.5)',
        }
      ] 
    };

    // Get top 10 users with most orders
    const topUsers = [...users]
      .sort((a, b) => b.totalOrders - a.totalOrders)
      .slice(0, 10);
    
    return {
      labels: topUsers.map(user => user.customerName?.split(' ')[0] || 'Unknown'),
      datasets: [
        {
          label: 'Total Orders',
          data: topUsers.map(user => user.totalOrders),
          backgroundColor: 'rgba(75, 192, 192, 0.5)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1,
        },
        {
          label: 'Completed Orders',
          data: topUsers.map(user => user.completedOrders),
          backgroundColor: 'rgba(54, 162, 235, 0.5)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1,
        },
        {
          label: 'Pending Orders',
          data: topUsers.map(user => user.pendingOrders),
          backgroundColor: 'rgba(255, 206, 86, 0.5)',
          borderColor: 'rgba(255, 206, 86, 1)',
          borderWidth: 1,
        },
      ],
    };
  };

  const calculateProviderRatingData = () => {
    if (!providers.length) return { 
      labels: ['No Ratings'], 
      datasets: [
        { 
          label: 'Providers',
          data: [0],
          borderColor: 'rgba(255, 99, 132, 1)',
          backgroundColor: 'rgba(255, 99, 132, 0.5)',
        }
      ] 
    };
    
    // Group providers by rating rounded to nearest 0.5
    const ratingCounts = {};
    
    for (let i = 0; i <= 5; i += 0.5) {
      ratingCounts[i] = 0;
    }
    
    providers.forEach(provider => {
      if (provider.providerRating !== null && provider.providerRating !== undefined) {
        // Round to nearest 0.5
        const roundedRating = Math.round(provider.providerRating * 2) / 2;
        ratingCounts[roundedRating] = (ratingCounts[roundedRating] || 0) + 1;
      }
    });
    
    return {
      labels: Object.keys(ratingCounts).map(rating => rating === '0' ? 'No Rating' : `${rating} Stars`),
      datasets: [
        {
          label: 'Number of Providers',
          data: Object.values(ratingCounts),
          borderColor: 'rgba(255, 99, 132, 1)',
          backgroundColor: 'rgba(255, 99, 132, 0.5)',
          tension: 0.1
        },
      ],
    };
  };

  const calculateUserAgeDistribution = () => {
    if (!users.length) return { 
      labels: ['No Data'], 
      datasets: [
        { 
          label: 'Users',
          data: [0],
          backgroundColor: 'rgba(153, 102, 255, 0.5)',
        }
      ] 
    };

    // Define age ranges
    const ageRanges = {
      'Under 20': 0,
      '20-30': 0,
      '31-40': 0,
      '41-50': 0,
      'Over 50': 0,
    };

    users.forEach(user => {
      const age = user.customerAge;
      if (age > 0) {
        if (age < 20) ageRanges['Under 20']++;
        else if (age >= 20 && age <= 30) ageRanges['20-30']++;
        else if (age >= 31 && age <= 40) ageRanges['31-40']++;
        else if (age >= 41 && age <= 50) ageRanges['41-50']++;
        else ageRanges['Over 50']++;
      }
    });

    return {
      labels: Object.keys(ageRanges),
      datasets: [
        {
          label: 'Number of Users',
          data: Object.values(ageRanges),
          backgroundColor: [
            'rgba(54, 162, 235, 0.7)',
            'rgba(75, 192, 192, 0.7)',
            'rgba(153, 102, 255, 0.7)',
            'rgba(255, 159, 64, 0.7)',
            'rgba(255, 99, 132, 0.7)'
          ],
          borderColor: [
            'rgba(54, 162, 235, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)',
            'rgba(255, 99, 132, 1)'
          ],
          borderWidth: 1,
        },
      ],
    };
  };
  const renderSection = () => {
    switch (selectedSection) {
      case "dashboard":
        return (
          <div className="section-content">
            <div className="dashboard-overview">
              <h2>📊 Admin Dashboard Overview</h2>
              <div className="stats-grid">
                <div className="stat-card">
                  <h3>Total Users</h3>
                  <p className="stat-number">{users.length}</p>
                </div>
                <div className="stat-card">
                  <h3>Total Providers</h3>
                  <p className="stat-number">{providers.length}</p>
                </div>
                <div className="stat-card">
                  <h3>Active Providers</h3>
                  <p className="stat-number">
                    {providers.filter(p => p.providerStatus).length}
                  </p>
                </div>
                <div className="stat-card">
                  <h3>Total Orders</h3>
                  <p className="stat-number">
                    {users.reduce((sum, user) => sum + (user.totalOrders || 0), 0)}
                  </p>
                </div>
                <div className="stat-card">
                  <h3>Average Rating</h3>
                  <p className="stat-number">
                    {providers.length > 0 
                      ? (providers.reduce((sum, provider) => sum + (provider.providerRating || 0), 0) / 
                          providers.filter(p => p.providerRating > 0).length).toFixed(1) 
                      : 'N/A'}
                    <span style={{ fontSize: '0.8em', marginLeft: '5px' }}>⭐</span>
                  </p>
                </div>
              </div>
              
              <div className="dashboard-charts">
                <div className="chart-row">
                  <div className="chart-container">
                    <h3>Service Providers Distribution</h3>
                    <Pie data={calculateProviderServiceData()} options={{ responsive: true, plugins: { legend: { position: 'right' } } }} />
                  </div>
                  <div className="chart-container">
                    <h3>Provider Status</h3>
                    <Pie data={calculateProviderStatusData()} options={{ responsive: true, plugins: { legend: { position: 'right' } } }} />
                  </div>
                  <div className="chart-container">
                    <h3>User Gender Distribution</h3>
                    <Pie data={calculateUserGenderData()} options={{ responsive: true, plugins: { legend: { position: 'right' } } }} />
                  </div>
                </div>
                
                <div className="chart-row">
                  <div className="chart-container wide">
                    <h3>Top User Orders</h3>
                    <Bar 
                      data={calculateCustomerOrdersData()} 
                      options={{
                        responsive: true,
                        plugins: { legend: { position: 'top' } },
                        scales: { y: { beginAtZero: true } }
                      }}
                    />
                  </div>
                </div>
                
                <div className="chart-row">
                  <div className="chart-container">
                    <h3>Provider Ratings Distribution</h3>
                    <Line 
                      data={calculateProviderRatingData()} 
                      options={{
                        responsive: true,
                        plugins: { legend: { display: false } },
                        scales: { y: { beginAtZero: true, title: { display: true, text: 'Number of Providers' } } }
                      }}
                    />
                  </div>
                  <div className="chart-container">
                    <h3>User Age Distribution</h3>
                    <Bar 
                      data={calculateUserAgeDistribution()} 
                      options={{
                        responsive: true,
                        plugins: { legend: { display: false } },
                        scales: { y: { beginAtZero: true } }
                      }}
                    />
                  </div>
                </div>
                
                <div className="dashboard-insights">
                  <h3>📈 Key Insights</h3>
                  <div className="insights-grid">
                    <div className="insight-card">
                      <h4>Most Popular Service</h4>
                      <p>{providers.length > 0 
                        ? (() => {
                            const workTypeCounts = providers.reduce((acc, provider) => {
                              const type = provider.providerWorkType;
                              acc[type] = (acc[type] || 0) + 1;
                              return acc;
                            }, {});
                            return Object.keys(workTypeCounts).reduce((a, b) => 
                              workTypeCounts[a] > workTypeCounts[b] ? a : b, Object.keys(workTypeCounts)[0]) || 'N/A';
                          })() 
                        : 'N/A'}
                      </p>
                    </div>
                    <div className="insight-card">
                      <h4>Highest Rated Service</h4>
                      <p>{providers.length > 0 
                        ? (() => {
                            const workTypeRatings = {};
                            const workTypeCounts = {};
                            
                            providers.forEach(provider => {
                              if (provider.providerRating > 0) {
                                const type = provider.providerWorkType;
                                workTypeRatings[type] = (workTypeRatings[type] || 0) + provider.providerRating;
                                workTypeCounts[type] = (workTypeCounts[type] || 0) + 1;
                              }
                            });
                            
                            let highestRatedType = 'N/A';
                            let highestRating = 0;
                            
                            Object.keys(workTypeRatings).forEach(type => {
                              const avgRating = workTypeRatings[type] / workTypeCounts[type];
                              if (avgRating > highestRating) {
                                highestRating = avgRating;
                                highestRatedType = type;
                              }
                            });
                            
                            return `${highestRatedType} (${highestRating.toFixed(1)}⭐)`;
                          })() 
                        : 'N/A'}
                      </p>
                    </div>
                    <div className="insight-card">
                      <h4>Most Active User</h4>
                      <p>{users.length > 0 
                        ? (() => {
                            const mostActiveUser = users.reduce((prev, current) => 
                              (prev.totalOrders || 0) > (current.totalOrders || 0) ? prev : current
                            );
                            return `${mostActiveUser.customerName} (${mostActiveUser.totalOrders || 0} orders)`;
                          })() 
                        : 'N/A'}
                      </p>
                    </div>
                    <div className="insight-card">
                      <h4>User Satisfaction</h4>
                      <p>{users.length > 0 
                        ? (() => {
                            const avgFeedback = users.reduce((sum, user) => sum + (user.averageFeedbackGiven || 0), 0) / 
                              users.filter(u => u.averageFeedbackGiven > 0).length;
                            return avgFeedback ? `${avgFeedback.toFixed(1)}⭐` : 'N/A';
                          })() 
                        : 'N/A'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case "users":
        return (
          <div className="section-content">
            <div className="section-header">
              <h2>Registered Users</h2>
              <p className="section-description">Manage all registered customers</p>
            </div>
            {renderUsersTable()}
          </div>
        );
      case "providers":
        return (
          <div className="section-content">
            <div className="section-header">
              <h2>Service Providers</h2>
              <p className="section-description">Manage all service providers</p>
            </div>
            {renderProvidersTable()}
          </div>
        );
      case "bookings":
        return <div className="section-content">📅 Monitoring all bookings</div>;
      case "reports":
        return <div className="section-content">📄 Viewing system reports and logs</div>;
      default:
        return <div className="section-content">Select a section</div>;
    }
  };

  // Custom sidebar item component
  const SidebarItem = ({ icon, label, count, active, onClick }) => (
    <li 
      className={active ? "active" : ""}
      onClick={onClick}
    >
      <span className="sidebar-icon">{icon}</span>
      <span className="sidebar-label">{label}</span>
      {count !== undefined && <span className="sidebar-count">{count}</span>}
    </li>
  );

  // Clock component for header
  function Clock() {
    const [time, setTime] = useState(new Date());
    
    useEffect(() => {
      const timer = setInterval(() => {
        setTime(new Date());
      }, 1000);
      
      return () => {
        clearInterval(timer);
      };
    }, []);
    
    const formatDate = (date) => {
      const options = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      };
      return date.toLocaleDateString('en-US', options);
    };
    
    const formatTime = (date) => {
      return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
    };
    
    return (
      <div className="clock">
        <div className="date">{formatDate(time)}</div>
        <div className="time">{formatTime(time)}</div>
      </div>
    );
  }

  return (
    <div className="admin-panel">
      <div className="sidebar">
        <div className="sidebar-header">
          <h2>Admin Panel</h2>
        </div>
        <ul>
          <SidebarItem 
            icon="📊"
            label="Dashboard"
            active={selectedSection === "dashboard"}
            onClick={() => setSelectedSection("dashboard")}
          />
          <SidebarItem 
            icon="👥"
            label="Users"
            count={users.length}
            active={selectedSection === "users"}
            onClick={() => setSelectedSection("users")}
          />
          <SidebarItem 
            icon="🔧"
            label="Service Providers"
            count={providers.length}
            active={selectedSection === "providers"}
            onClick={() => setSelectedSection("providers")}
          />
          <SidebarItem 
            icon="📅"
            label="Bookings"
            active={selectedSection === "bookings"}
            onClick={() => setSelectedSection("bookings")}
          />
          <SidebarItem 
            icon="📄"
            label="Reports"
            active={selectedSection === "reports"}
            onClick={() => setSelectedSection("reports")}
          />
          <SidebarItem 
            icon="⚙️"
            label="Settings"
            active={selectedSection === "settings"}
            onClick={() => setSelectedSection("settings")}
          />
        </ul>
        <div className="sidebar-footer">
          <div className="admin-info">
            <div className="admin-avatar">👩‍💼</div>
            <div className="admin-details">
              <p className="admin-name">Admin User</p>
              <p className="admin-role">Super Admin</p>
            </div>
          </div>
        </div>
      </div>
      <div className="main-content">
        <header>
          <h1>{selectedSection.charAt(0).toUpperCase() + selectedSection.slice(1)}</h1>
          <Clock />
        </header>
        <div className="content-area">{renderSection()}</div>
      </div>
    </div>
  );
}

export default AdminPage;