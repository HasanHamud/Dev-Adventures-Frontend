import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import axios from 'axios';
import { useSnackbar } from 'notistack';

const FormField = ({ label, children, required = false }) => (
  <div className="mb-4">
    <label className="block text-base font-medium text-gray-300 mb-2">
      {label} {required && <span className="text-red-400">*</span>}
    </label>
    {children}
  </div>
);

export const EditPlanModal = ({ isOpen, onClose, onSuccess, plan }) => {
  const { enqueueSnackbar } = useSnackbar();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    discount: 0,
    level: 0,
    courseIds: []
  });
  
  const [availableCourses, setAvailableCourses] = useState([]);
  const [selectedCourses, setSelectedCourses] = useState([]);
  const BASE_URL = 'http://localhost:5101';

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const response = await axios.get(`${BASE_URL}/api/Courses`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setAvailableCourses(response.data);
      } catch (error) {
        const errorMessage = error.response?.data || 'Error fetching courses';
        enqueueSnackbar(errorMessage, { variant: 'error' });
      }
    };

    if (isOpen && plan) {
      fetchCourses();
      // Updated to handle both camelCase and PascalCase properties
      setFormData({
        title: plan.title || plan.Title || '',
        description: plan.description || plan.Description || '',
        discount: plan.discount || plan.Discount || 0,
        level: plan.level || plan.Level || 0,
        courseIds: (plan.plansCourses || plan.PlansCourses || [])
          .map(pc => pc.course?.id || pc.Course?.Id)
          .filter(id => id != null)
      });

      setSelectedCourses((plan.plansCourses || plan.PlansCourses || [])
        .map(pc => pc.course || pc.Course)
        .filter(course => course != null)
      );
    }
  }, [isOpen, plan]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: ['discount', 'level'].includes(name) ? parseInt(value) : value
    }));
  };

  const handleAddCourse = (e) => {
    const courseId = parseInt(e.target.value);
    if (!courseId) return;

    const course = availableCourses.find(c => c.id === courseId);
    
    if (course && !selectedCourses.some(sc => sc.id === courseId)) {
      const newSelectedCourses = [...selectedCourses, course];
      setSelectedCourses(newSelectedCourses);
      setFormData(prevState => ({
        ...prevState,
        courseIds: newSelectedCourses.map(c => c.id)
      }));
    }

    e.target.value = '';
  };

  const handleRemoveCourse = (courseId) => {
    setSelectedCourses(prev => prev.filter(course => course.id !== courseId));
    setFormData(prevState => ({
      ...prevState,
      courseIds: prevState.courseIds.filter(id => id !== courseId)
    }));
  };

  const validateForm = () => {
    if (!formData.title.trim()) {
      enqueueSnackbar('Please enter a plan title', { variant: 'error' });
      return false;
    }
    if (!formData.description.trim()) {
      enqueueSnackbar('Please enter a plan description', { variant: 'error' });
      return false;
    }
    if (formData.discount < 0 || formData.discount > 100) {
      enqueueSnackbar('Discount must be between 0 and 100', { variant: 'error' });
      return false;
    }
    if (selectedCourses.length === 0) {
      enqueueSnackbar('Please select at least one course', { variant: 'error' });
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm() || isSubmitting) return;

    setIsSubmitting(true);
    const token = localStorage.getItem('authToken');

    try {
      const response = await axios.put(
        `${BASE_URL}/${plan.id || plan.Id}`,
        formData,
        {
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      enqueueSnackbar('Plan updated successfully', { variant: 'success' });
      if (onSuccess) onSuccess(response.data);
      onClose();
    } catch (error) {
      const errorMessage = error.response?.data || 'Error updating plan';
      enqueueSnackbar(errorMessage, { variant: 'error' });
      console.error('Error details:', error.response || error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen || !plan) return null;

  const remainingCourses = availableCourses.filter(
    course => !selectedCourses.some(sc => sc.id === course.id)
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 p-6 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-white">Edit Plan: {plan.title || plan.Title}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-300"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <FormField label="Plan Title" required>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full p-2 bg-gray-700 text-white rounded border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              placeholder="Enter plan title"
              required
            />
          </FormField>

          <FormField label="Plan Description" required>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full p-2 bg-gray-700 text-white rounded border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              placeholder="Enter plan description"
              rows="3"
              required
            />
          </FormField>

          <FormField label="Discount (%)" required>
            <input 
              type="number"
              name="discount"
              value={formData.discount}
              onChange={handleChange}
              className="w-full p-2 bg-gray-700 text-white rounded border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              placeholder="Enter discount percentage"
              min="0"
              max="100"
              required
            />
          </FormField>

          <FormField label="Level" required>
            <select
              name="level"
              value={formData.level}
              onChange={handleChange}
              className="w-full p-2 bg-gray-700 text-white rounded border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              required
            >
              <option value={0}>Beginner</option>
              <option value={1}>Intermediate</option>
              <option value={2}>Advanced</option>
            </select>
          </FormField>

          <FormField label="Add Courses" required>
            <select
              onChange={handleAddCourse}
              className="w-full p-2 bg-gray-700 text-white rounded border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              value=""
            >
              <option value="">Select a course to add</option>
              {remainingCourses.map(course => (
                <option key={course.id} value={course.id}>
                  {course.title} - {course.level === 0 ? 'Beginner' : course.level === 1 ? 'Intermediate' : 'Advanced'}
                </option>
              ))}
            </select>
          </FormField>

          {selectedCourses.length > 0 && (
            <div className="mb-4">
              <h3 className="text-white font-medium mb-2">Selected Courses:</h3>
              <div className="space-y-2">
                {selectedCourses.map((course, index) => (
                  <div 
                    key={course.id}
                    className="flex items-center justify-between bg-gray-700 p-2 rounded border border-gray-600"
                  >
                    <span className="text-white">
                      {index + 1}. {course.title} - {course.level === 0 ? 'Beginner' : course.level === 1 ? 'Intermediate' : 'Advanced'}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveCourse(course.id)}
                      className="text-red-400 hover:text-red-300"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-end mt-6 gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-500 focus:ring-2 focus:ring-gray-400"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500 focus:ring-2 focus:ring-blue-400 disabled:bg-blue-800 disabled:cursor-not-allowed"
              disabled={isSubmitting || selectedCourses.length === 0}
            >
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditPlanModal;