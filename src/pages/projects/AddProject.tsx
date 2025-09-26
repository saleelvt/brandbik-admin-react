/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, ChangeEvent, FormEvent, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../reduxKit/store";
import { adminAddProjectAction,adminGetProjects } from "../../reduxKit/actions/admin/projectActions";
import toast from "react-hot-toast";

interface ProjectData {
  projectName: string;
  projectNameAr: string;
  description: string;
  descriptionAr: string;
  mainImg: File | null;
  backGroundImage: File | null;
  heading: string;
  headingAr: string;
  industryName: string;
  industryNameAr: string;
  service: string;
  serviceAr: string;
  category: string;
  categoryAr: string;
  scopDiscription: string;
  scopDiscriptionAr: string;
  challenges: string;
  challengesAr: string;
  servicesProvided: string[];
  servicesProvidedAr: string[];
  images: File[];
}

const initialProject: ProjectData = {
  projectName: "",
  projectNameAr: "",
  description: "",
  descriptionAr: "",
  mainImg: null,
  backGroundImage: null,
  heading: "",
  headingAr: "",
  industryName: "",
  industryNameAr: "",
  service: "",
  serviceAr: "",
  category: "",
  categoryAr: "",
  scopDiscription: "",
  scopDiscriptionAr: "",
  challenges: "",
  challengesAr: "",
  servicesProvided: [],
  servicesProvidedAr: [],
  images: [],
}; 

export default function AddProject() {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error } = useSelector((state: RootState) => state.project || {});
  
  const [project, setProject] = useState<ProjectData>(initialProject);
  const [errors, setErrors] = useState<Partial<Record<keyof ProjectData, string>>>({});
  const [serviceInput, setServiceInput] = useState("");
  const [serviceInputAr, setServiceInputAr] = useState("");
  const [imagePreview, setImagePreview] = useState<{
    mainImg: string | null;
    backGroundImage: string | null;
    images: string[];
  }>({
    mainImg: null,
    backGroundImage: null,
    images: [],
  });

  // Validate image file
  const validateImageFile = (file: File): string | null => {
    const maxSize = 3 * 1024 * 1024; // 3MB
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    
    if (!allowedTypes.includes(file.type)) {
      return "Please upload a valid image file (JPEG, JPG, PNG, GIF, WEBP)";
    }
    
    if (file.size > maxSize) {
      return "Image size should be less than 3MB";
    }
    
    return null;
  };

  // Handle input changes
  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProject((prev) => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name as keyof ProjectData]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // Handle single image upload
  const handleSingleImageUpload = (e: ChangeEvent<HTMLInputElement>, fieldName: 'mainImg' | 'backGroundImage') => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validationError = validateImageFile(file);
    if (validationError) {
      setErrors((prev) => ({ ...prev, [fieldName]: validationError }));
      toast.error(validationError);
      return;
    }

    setProject((prev) => ({ ...prev, [fieldName]: file }));
    
    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview((prev) => ({
        ...prev,
        [fieldName]: e.target?.result as string,
      }));
    };
    reader.readAsDataURL(file);

    // Clear error
    setErrors((prev) => ({ ...prev, [fieldName]: "" }));
  };

  // Handle multiple images upload
  const handleMultipleImagesUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const validFiles: File[] = [];
    const previews: string[] = [];
    let hasError = false;

    files.forEach((file) => {
      const validationError = validateImageFile(file);
      if (validationError) {
        toast.error(`${file.name}: ${validationError}`);
        hasError = true;
        return;
      }
      validFiles.push(file);
    });

    if (hasError) {
      setErrors((prev) => ({ ...prev, images: "Some images were rejected due to validation errors" }));
      return;
    }

    // Create previews
    validFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        previews.push(e.target?.result as string);
        if (previews.length === validFiles.length) {
          setImagePreview((prev) => ({
            ...prev,
            images: [...prev.images, ...previews],
          }));
        }
      };
      reader.readAsDataURL(file);
    });

    setProject((prev) => ({ 
      ...prev, 
      images: [...prev.images, ...validFiles] 
    }));

    // Clear error
    setErrors((prev) => ({ ...prev, images: "" }));
  };

  // Remove single image
  const removeSingleImage = (fieldName: 'mainImg' | 'backGroundImage') => {
    setProject((prev) => ({ ...prev, [fieldName]: null }));
    setImagePreview((prev) => ({ ...prev, [fieldName]: null }));
  };

  // Remove image from multiple images
  const removeMultipleImage = (index: number) => {
    setProject((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
    setImagePreview((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  // Add service to array
  const addService = (language: 'en' | 'ar') => {
    const input = language === 'en' ? serviceInput : serviceInputAr;
    const field = language === 'en' ? 'servicesProvided' : 'servicesProvidedAr';
    
    if (!input.trim()) {
      toast.error(`Please enter a service name ${language === 'ar' ? 'in Arabic' : 'in English'}`);
      return;
    }

    if (project[field].includes(input.trim())) {
      toast.error("This service is already added");
      return;
    }

    setProject((prev) => ({
      ...prev,
      [field]: [...prev[field], input.trim()],
    }));

    if (language === 'en') {
      setServiceInput("");
    } else {
      setServiceInputAr("");
    }
  };

  // Remove service from array
  const removeService = (index: number, language: 'en' | 'ar') => {
    const field = language === 'en' ? 'servicesProvided' : 'servicesProvidedAr';
    setProject((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));
  };

  // Form validation
  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof ProjectData, string>> = {};

    // Required fields validation
    if (!project.projectName.trim()) newErrors.projectName = "Project name is required";
    if (!project.projectNameAr.trim()) newErrors.projectNameAr = "Project name (Arabic) is required";
    if (!project.description.trim()) newErrors.description = "Description is required";
    if (!project.descriptionAr.trim()) newErrors.descriptionAr = "Description (Arabic) is required";
    if (!project.heading.trim()) newErrors.heading = "Heading is required";
    if (!project.headingAr.trim()) newErrors.headingAr = "Heading (Arabic) is required";
    if (!project.industryName.trim()) newErrors.industryName = "Industry name is required";
    if (!project.industryNameAr.trim()) newErrors.industryNameAr = "Industry name (Arabic) is required";
    if (!project.service.trim()) newErrors.service = "Service is required";
    if (!project.serviceAr.trim()) newErrors.serviceAr = "Service (Arabic) is required";
    if (!project.category.trim()) newErrors.category = "Category is required";
    if (!project.categoryAr.trim()) newErrors.categoryAr = "Category (Arabic) is required";
    if (!project.scopDiscription.trim()) newErrors.scopDiscription = "Scope description is required";
    if (!project.scopDiscriptionAr.trim()) newErrors.scopDiscriptionAr = "Scope description (Arabic) is required";
    if (!project.challenges.trim()) newErrors.challenges = "Challenges are required";
    if (!project.challengesAr.trim()) newErrors.challengesAr = "Challenges (Arabic) are required";
    if (!project.mainImg) newErrors.mainImg = "Main image is required";
    if (!project.backGroundImage) newErrors.backGroundImage = "Background image is required";
    if (project.servicesProvided.length === 0) newErrors.servicesProvided = "At least one service must be provided";
    if (project.servicesProvidedAr.length === 0) newErrors.servicesProvidedAr = "At least one service (Arabic) must be provided";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      const formData = new FormData();
      
      // Append text fields
      formData.append('projectName', project.projectName);
      formData.append('projectNameAr', project.projectNameAr);
      formData.append('description', project.description);
      formData.append('descriptionAr', project.descriptionAr);
      formData.append('heading', project.heading);
      formData.append('headingAr', project.headingAr);
      formData.append('industryName', project.industryName);
      formData.append('industryNameAr', project.industryNameAr);
      formData.append('service', project.service);
      formData.append('serviceAr', project.serviceAr);
      formData.append('category', project.category);
      formData.append('categoryAr', project.categoryAr);
      formData.append('scopDiscription', project.scopDiscription);
      formData.append('scopDiscriptionAr', project.scopDiscriptionAr);
      formData.append('challenges', project.challenges);
      formData.append('challengesAr', project.challengesAr);

      // Append arrays as JSON strings
      formData.append('servicesProvided', JSON.stringify(project.servicesProvided));
      formData.append('servicesProvidedAr', JSON.stringify(project.servicesProvidedAr));

      // Append single images
      if (project.mainImg) {
        formData.append('mainImg', project.mainImg);
      }
      if (project.backGroundImage) {
        formData.append('backGroundImage', project.backGroundImage);
      }

      // Append multiple images
      project.images.forEach((image) => {
        formData.append('images', image);
      });

      const result = await dispatch(adminAddProjectAction(formData)).unwrap();

      console.log("Project adding result:", result);
      
      if (result.success) {
        toast.success("Project created successfully!");
        setProject(initialProject);
        setErrors({});
        setImagePreview({ mainImg: null, backGroundImage: null, images: [] });
        setServiceInput("");
        setServiceInputAr("");
      }
    } catch (error: any) {
      console.error("Project creation error:", error);
      
      if (error?.message) {
        toast.error(error.message);
      } else if (typeof error === 'string') {
        toast.error(error);
      } else {
        toast.error("Failed to create project. Please try again.");
      }
    }
  };

  useEffect(()=>{
    const data = dispatch(adminGetProjects())
    console.log("data is the data : ", data 
    );
    
  },[dispatch])

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gradient-to-br from-blue-50 to-white rounded-2xl shadow-lg">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-extrabold text-blue-700 tracking-tight">
          Add New Project
        </h2>
        <button
          onClick={() => navigate("/works-list")}
          className="px-5 py-2 rounded-full font-semibold bg-purple-600 text-white shadow hover:bg-purple-700 transition-all duration-300"
        >
          View All Projects
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Basic Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Project Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Project Name (English) *
              </label>
              <input
                type="text"
                name="projectName"
                value={project.projectName}
                onChange={handleInputChange}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.projectName ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter project name in English"
              />
              {errors.projectName && <p className="text-red-500 text-sm mt-1">{errors.projectName}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Project Name (Arabic) *
              </label>
              <input
                type="text"
                name="projectNameAr"
                value={project.projectNameAr}
                onChange={handleInputChange}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.projectNameAr ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter project name in Arabic"
                dir="rtl"
              />
              {errors.projectNameAr && <p className="text-red-500 text-sm mt-1">{errors.projectNameAr}</p>}
            </div>

            {/* Heading */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Heading (English) *
              </label>
              <input
                type="text"
                name="heading"
                value={project.heading}
                onChange={handleInputChange}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.heading ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter heading in English"
              />
              {errors.heading && <p className="text-red-500 text-sm mt-1">{errors.heading}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Heading (Arabic) *
              </label>
              <input
                type="text"
                name="headingAr"
                value={project.headingAr}
                onChange={handleInputChange}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.headingAr ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter heading in Arabic"
                dir="rtl"
              />
              {errors.headingAr && <p className="text-red-500 text-sm mt-1">{errors.headingAr}</p>}
            </div>

            {/* Industry */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Industry Name (English) *
              </label>
              <input
                type="text"
                name="industryName"
                value={project.industryName}
                onChange={handleInputChange}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.industryName ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter industry name in English"
              />
              {errors.industryName && <p className="text-red-500 text-sm mt-1">{errors.industryName}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Industry Name (Arabic) *
              </label>
              <input
                type="text"
                name="industryNameAr"
                value={project.industryNameAr}
                onChange={handleInputChange}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.industryNameAr ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter industry name in Arabic"
                dir="rtl"
              />
              {errors.industryNameAr && <p className="text-red-500 text-sm mt-1">{errors.industryNameAr}</p>}
            </div>

            {/* Service */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Service (English) *
              </label>
              <input
                type="text"
                name="service"
                value={project.service}
                onChange={handleInputChange}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.service ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter service in English"
              />
              {errors.service && <p className="text-red-500 text-sm mt-1">{errors.service}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Service (Arabic) *
              </label>
              <input
                type="text"
                name="serviceAr"
                value={project.serviceAr}
                onChange={handleInputChange}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.serviceAr ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter service in Arabic"
                dir="rtl"
              />
              {errors.serviceAr && <p className="text-red-500 text-sm mt-1">{errors.serviceAr}</p>}
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category (English) *
              </label>
              <input
                type="text"
                name="category"
                value={project.category}
                onChange={handleInputChange}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.category ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter category in English"
              />
              {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category (Arabic) *
              </label>
              <input
                type="text"
                name="categoryAr"
                value={project.categoryAr}
                onChange={handleInputChange}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.categoryAr ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter category in Arabic"
                dir="rtl"
              />
              {errors.categoryAr && <p className="text-red-500 text-sm mt-1">{errors.categoryAr}</p>}
            </div>
          </div>

          {/* Descriptions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description (English) *
              </label>
              <textarea
                name="description"
                value={project.description}
                onChange={handleInputChange}
                rows={4}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.description ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter project description in English"
              />
              {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description (Arabic) *
              </label>
              <textarea
                name="descriptionAr"
                value={project.descriptionAr}
                onChange={handleInputChange}
                rows={4}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.descriptionAr ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter project description in Arabic"
                dir="rtl"
              />
              {errors.descriptionAr && <p className="text-red-500 text-sm mt-1">{errors.descriptionAr}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Scope Description (English) *
              </label>
              <textarea
                name="scopDiscription"
                value={project.scopDiscription}
                onChange={handleInputChange}
                rows={4}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.scopDiscription ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter scope description in English"
              />
              {errors.scopDiscription && <p className="text-red-500 text-sm mt-1">{errors.scopDiscription}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Scope Description (Arabic) *
              </label>
              <textarea
                name="scopDiscriptionAr"
                value={project.scopDiscriptionAr}
                onChange={handleInputChange}
                rows={4}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.scopDiscriptionAr ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter scope description in Arabic"
                dir="rtl"
              />
              {errors.scopDiscriptionAr && <p className="text-red-500 text-sm mt-1">{errors.scopDiscriptionAr}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Challenges (English) *
              </label>
              <textarea
                name="challenges"
                value={project.challenges}
                onChange={handleInputChange}
                rows={4}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.challenges ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter challenges in English"
              />
              {errors.challenges && <p className="text-red-500 text-sm mt-1">{errors.challenges}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Challenges (Arabic) *
              </label>
              <textarea
                name="challengesAr"
                value={project.challengesAr}
                onChange={handleInputChange}
                rows={4}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.challengesAr ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter challenges in Arabic"
                dir="rtl"
              />
              {errors.challengesAr && <p className="text-red-500 text-sm mt-1">{errors.challengesAr}</p>}
            </div>
          </div>
        </div>

        {/* Services Provided */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Services Provided</h3>
          
          {/* English Services */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Services Provided (English) *
            </label>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={serviceInput}
                onChange={(e) => setServiceInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addService('en'))}
                className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter a service and press Add"
              />
              <button
                type="button"
                onClick={() => addService('en')}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {project.servicesProvided.map((service, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                >
                  {service}
                  <button
                    type="button"
                    onClick={() => removeService(index, 'en')}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            {errors.servicesProvided && <p className="text-red-500 text-sm mt-1">{errors.servicesProvided}</p>}
          </div>

          {/* Arabic Services */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Services Provided (Arabic) *
            </label>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={serviceInputAr}
                onChange={(e) => setServiceInputAr(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addService('ar'))}
                className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter a service in Arabic and press Add"
                dir="rtl"
              />
              <button
                type="button"
                onClick={() => addService('ar')}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {project.servicesProvidedAr.map((service, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
                  dir="rtl"
                >
                  {service}
                  <button
                    type="button"
                    onClick={() => removeService(index, 'ar')}
                    className="text-green-600 hover:text-green-800"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            {errors.servicesProvidedAr && <p className="text-red-500 text-sm mt-1">{errors.servicesProvidedAr}</p>}
          </div>
        </div>

        {/* Images */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Images</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Main Image */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Main Image * (Max 3MB)
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleSingleImageUpload(e, 'mainImg')}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {errors.mainImg && <p className="text-red-500 text-sm mt-1">{errors.mainImg}</p>}
              {imagePreview.mainImg && (
                <div className="mt-3 relative">
                  <img
                    src={imagePreview.mainImg}
                    alt="Main preview"
                    className="w-full h-32 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => removeSingleImage('mainImg')}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600"
                  >
                    ×
                  </button>
                </div>
              )}
            </div>

            {/* Background Image */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Background Image * (Max 3MB)
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleSingleImageUpload(e, 'backGroundImage')}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {errors.backGroundImage && <p className="text-red-500 text-sm mt-1">{errors.backGroundImage}</p>}
              {imagePreview.backGroundImage && (
                <div className="mt-3 relative">
                  <img
                    src={imagePreview.backGroundImage}
                    alt="Background preview"
                    className="w-full h-32 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => removeSingleImage('backGroundImage')}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600"
                  >
                    ×
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Multiple Images */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Additional Images (Max 3MB each)
            </label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleMultipleImagesUpload}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {errors.images && <p className="text-red-500 text-sm mt-1">{errors.images}</p>}
            
            {imagePreview.images.length > 0 && (
              <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Selected Images:</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {imagePreview.images.map((preview, index) => (
                    <div key={index} className="relative">
                      <img
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeMultipleImage(index)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => navigate("/Projects")}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className={`px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg shadow-lg transition-all duration-300 ${
              loading 
                ? 'opacity-50 cursor-not-allowed' 
                : 'hover:from-blue-700 hover:to-purple-700 hover:shadow-xl transform hover:-translate-y-0.5'
            }`}
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Creating Project...
              </div>
            ) : (
              'Create Project'
            )}
          </button>
        </div>
      </form>

      {/* Error Display */}
      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700 text-sm">
            {typeof error === 'string' ? error : 'An error occurred while creating the project'}
          </p>
        </div>
      )}
    </div>
  );
}