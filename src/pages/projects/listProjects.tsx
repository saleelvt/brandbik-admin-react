/* eslint-disable @typescript-eslint/no-explicit-any */
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../reduxKit/store";
import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom"; // Add this back in your actual component
import { adminGetProjects, adminDeleteProjectById } from "../../reduxKit/actions/admin/projectActions";

export default function ProjectList() {
  // const navigate = useNavigate(); // Add this back in your actual component
  const dispatch = useDispatch<AppDispatch>();
  const { loading } = useSelector((state: RootState) => state.project);
  
  const [projects, setProjects] = useState<any[]>([]);
  const [deleteLoading, setDeleteLoading] = useState<string>("");
  const [expandedProject, setExpandedProject] = useState<string | null>(null);

  useEffect(() => {
    fetchProjects();
  }, [dispatch]);

  const fetchProjects = async () => {
    try {
      const result = await dispatch(adminGetProjects()).unwrap();
      console.log("Projects fetched:", result.data);
      setProjects(result.data);
    } catch (err) {
      console.error("Error fetching projects:", err);
    }
  };

  const handleDeleteProject = async (id: string, projectName: string) => {
    if (!confirm(`Are you sure you want to delete "${projectName}"?`)) return;
    
    try {
      setDeleteLoading(id);
      await dispatch(adminDeleteProjectById(id)).unwrap();
      alert("Project deleted successfully!");
      fetchProjects(); // Refresh the list
    } catch (error) {
      console.error("Error deleting project:", error);
      alert("Error deleting project. Please try again.");
    } finally {
      setDeleteLoading("");
    }
  };

  const handleUpdateProject = (id: string) => {
    // navigate("/updateProject", { state: { id } }); // Add this back in your actual component
    console.log("Update project:", id);
  };

  const toggleExpandProject = (projectId: string) => {
    setExpandedProject(expandedProject === projectId ? null : projectId);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-8 bg-white rounded-2xl shadow-lg">
        <div className="text-center text-lg">Loading Projects...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 bg-white rounded-2xl shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl md:text-3xl font-extrabold text-blue-700 tracking-tight">
          All Projects ({projects?.length || 0})
        </h2>
        <a
          href="/add-Work"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold shadow hover:bg-blue-700 transition-colors"
        >
          + Add New Project
        </a>
      </div>

      {!projects || projects.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-500 text-lg mb-4">No projects found</div>
          <a
            href="/add-Work"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Create Your First Project
          </a>
        </div>
      ) : (
        <div className="space-y-8">
          {projects.map((project) => (
            <div key={project._id} className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
              {/* Project Header */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-3">
                      <img
                        src={project.mainImg}
                        alt={project.projectName}
                        className="w-16 h-16 object-cover rounded-lg shadow-md"
                      />
                      <div>
                        <h3 className="text-xl font-bold text-gray-800">{project.projectName}</h3>
                        <p className="text-lg text-gray-600" dir="rtl">{project.projectNameAr}</p>
                        <div className="flex gap-2 mt-2">
                          <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                            {project.industryName}
                          </span>
                          <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                            {project.service}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 ml-4">
                    <span className="text-sm text-gray-500 bg-white px-3 py-1 rounded-full shadow">
                      {formatDate(project.createdAt)}
                    </span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => toggleExpandProject(project._id)}
                        className="bg-indigo-600 text-white px-3 py-1 rounded text-sm hover:bg-indigo-700 transition-colors"
                      >
                        {expandedProject === project._id ? "Collapse" : "Expand"}
                      </button>
                      <button
                        onClick={() => handleUpdateProject(project._id)}
                        className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteProject(project._id, project.projectName)}
                        disabled={deleteLoading === project._id}
                        className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition-colors disabled:opacity-50"
                      >
                        {deleteLoading === project._id ? "..." : "Delete"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Project Content */}
              <div className="p-6">
                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <h4 className="font-semibold text-gray-700 mb-2">Heading:</h4>
                    <p className="text-gray-800 mb-1">{project.heading}</p>
                    <p className="text-gray-600" dir="rtl">{project.headingAr}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-700 mb-2">Industry & Service:</h4>
                    <p className="text-gray-800 mb-1">{project.industryName} - {project.service}</p>
                    <p className="text-gray-600" dir="rtl">{project.industryNameAr} - {project.serviceAr}</p>
                  </div>
                </div>

                {/* Description */}
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-700 mb-2">Description:</h4>
                  <p className="text-gray-800 mb-2">{project.description}</p>
                  <p className="text-gray-600" dir="rtl">{project.descriptionAr}</p>
                </div>

                {/* Services Provided */}
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-700 mb-3">Services Provided:</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-2">English:</p>
                      <div className="flex flex-wrap gap-2">
                        {project.servicesProvided?.map((service: string, index: number) => (
                          <span key={index} className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">
                            {service}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-2">Arabic:</p>
                      <div className="flex flex-wrap gap-2" dir="rtl">
                        {project.servicesProvidedAr?.map((service: string, index: number) => (
                          <span key={index} className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm">
                            {service}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Images Section */}
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-700 mb-3">
                    Project Images ({(project.images?.length || 0) + 2} total):
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {/* Main Image */}
                    <div className="relative group">
                      <img
                        src={project.mainImg}
                        alt="Main Image"
                        className="w-full h-24 object-cover rounded-lg shadow-md hover:shadow-lg transition-shadow"
                      />
                      <div className="absolute bottom-1 left-1 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                        Main
                      </div>
                    </div>
                    
                    {/* Background Image */}
                    <div className="relative group">
                      <img
                        src={project.backGroundImage}
                        alt="Background Image"
                        className="w-full h-24 object-cover rounded-lg shadow-md hover:shadow-lg transition-shadow"
                      />
                      <div className="absolute bottom-1 left-1 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                        Background
                      </div>
                    </div>

                    {/* Additional Images */}
                    {project.images?.map((img: string, index: number) => (
                      <div key={index} className="relative group">
                        <img
                          src={img}
                          alt={`Additional ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg shadow-md hover:shadow-lg transition-shadow"
                        />
                        <div className="absolute bottom-1 left-1 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                          #{index + 1}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Expanded Details */}
                {expandedProject === project._id && (
                  <div className="border-t pt-6 space-y-6">
                    {/* Scope Description */}
                    <div>
                      <h4 className="font-semibold text-gray-700 mb-2">Scope Description:</h4>
                      <p className="text-gray-800 mb-2">{project.scopDiscription}</p>
                      <p className="text-gray-600" dir="rtl">{project.scopDiscriptionAr}</p>
                    </div>

                    {/* Challenges */}
                    <div>
                      <h4 className="font-semibold text-gray-700 mb-2">Challenges:</h4>
                      <p className="text-gray-800 mb-2">{project.challenges}</p>
                      <p className="text-gray-600" dir="rtl">{project.challengesAr}</p>
                    </div>

                    {/* Project Statistics */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-700 mb-3">Project Statistics:</h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                        <div className="bg-blue-100 rounded-lg p-3">
                          <div className="text-2xl font-bold text-blue-800">{(project.images?.length || 0) + 2}</div>
                          <div className="text-sm text-blue-600">Total Images</div>
                        </div>
                        <div className="bg-purple-100 rounded-lg p-3">
                          <div className="text-2xl font-bold text-purple-800">{project.servicesProvided?.length || 0}</div>
                          <div className="text-sm text-purple-600">Services (EN)</div>
                        </div>
                        <div className="bg-orange-100 rounded-lg p-3">
                          <div className="text-2xl font-bold text-orange-800">{project.servicesProvidedAr?.length || 0}</div>
                          <div className="text-sm text-orange-600">Services (AR)</div>
                        </div>
                        <div className="bg-green-100 rounded-lg p-3">
                          <div className="text-2xl font-bold text-green-800">
                            {Math.ceil((Date.now() - new Date(project.createdAt).getTime()) / (1000 * 60 * 60 * 24))}
                          </div>
                          <div className="text-sm text-green-600">Days Old</div>
                        </div>
                      </div>
                    </div>

                    {/* Timestamps */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-700 mb-2">Timeline:</h4>
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>🗓️ Created: {formatDate(project.createdAt)}</span>
                        <span>📝 Updated: {formatDate(project.updatedAt)}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}