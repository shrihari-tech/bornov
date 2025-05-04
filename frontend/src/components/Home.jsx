import React, { useState, useEffect } from 'react';
import { Card, Modal, Button, Input, Typography, Empty, Spin, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, LogoutOutlined, BookOutlined } from '@ant-design/icons';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const { Title, Paragraph } = Typography;

const Home = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        title: '',
        content: '',
    });
    const [selectedBlog, setSelectedBlog] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const navigate = useNavigate();

    // Get the author ID from sessionStorage
    const authorId = sessionStorage.getItem('user');

    // Fetch blogs created by the author
    useEffect(() => {
        const fetchBlogs = async () => {
            if (!authorId) {
                console.error('Author ID not found in sessionStorage');
                return;
            }

            setLoading(true);
            try {
                const response = await axios.get(`http://localhost:5000/blog/getBlog/${authorId}`);
                // console.log('Fetched Blogs:', response.data);
                setBlogs(response.data);
            } catch (error) {
                console.error('Error fetching blogs:', error);
                message.error('Failed to load blogs. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchBlogs();
    }, [authorId]);

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleUpload = async () => {
        if (formData.title && formData.content) {
            setSubmitting(true);
            try {
                const newBlog = {
                    title: formData.title,
                    content: formData.content,
                    author: authorId,
                };

                const response = await axios.post('http://localhost:5000/blog/postBlog', newBlog);
                // console.log('Blog Created:', response.data);

                setBlogs([...blogs, response.data]);
                setFormData({ title: '', content: '' });
                setIsModalOpen(false);
                message.success('Blog post created successfully!');
            } catch (error) {
                console.error('Error creating blog:', error);
                message.error('Failed to create blog. Please try again.');
            } finally {
                setSubmitting(false);
            }
        } else {
            message.warning('Please fill in both title and content fields.');
        }
    };

    const handleCardClick = (blog) => {
        setSelectedBlog(blog);
        setFormData({ title: blog.title, content: blog.content });
        setIsModalOpen(true);
    };

    const handleEdit = async () => {
        if (selectedBlog) {
            setSubmitting(true);
            try {
                const updatedBlog = {
                    title: formData.title,
                    content: formData.content,
                };

                const response = await axios.put(
                    `http://localhost:5000/blog/editBlog/${selectedBlog._id}`,
                    updatedBlog
                );
                console.log('Blog Updated:', response.data);

                const updatedBlogs = blogs.map((blog) =>
                    blog._id === selectedBlog._id ? response.data : blog
                );
                setBlogs(updatedBlogs);
                setSelectedBlog(null);
                setFormData({ title: '', content: '' });
                setIsModalOpen(false);
                message.success('Blog post updated successfully!');
            } catch (error) {
                console.error('Error updating blog:', error);
                message.error('Failed to update blog. Please try again.');
            } finally {
                setSubmitting(false);
            }
        }
    };

    const handleDelete = async () => {
        if (selectedBlog) {
            setSubmitting(true);
            try {
                const blogId = selectedBlog._id;
                await axios.delete(`http://localhost:5000/blog/deleteBlog/${blogId}`);
                console.log('Blog Deleted:', selectedBlog);

                const updatedBlogs = blogs.filter((blog) => blog._id !== blogId);
                setBlogs(updatedBlogs);
                setSelectedBlog(null);
                setIsModalOpen(false);
                message.success('Blog post deleted successfully!');
            } catch (error) {
                console.error('Error deleting blog:', error);
                message.error('Failed to delete blog. Please try again.');
            } finally {
                setSubmitting(false);
            }
        }
    };

    const handleLogout = () => {
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('user');
        message.info('You have been logged out');
        navigate('/login');
    };

    const truncateContent = (content, maxLength = 100) => {
        if (content.length <= maxLength) return content;
        return content.substring(0, maxLength) + '...';
    };

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <div className="max-w-6xl mx-auto">
                <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                    <div className="flex justify-between items-center w-full mb-4">
                        <div className="flex items-center">
                            <BookOutlined className="text-blue-500 text-2xl mr-2" />
                            <Title level={2} style={{ margin: 0 }}>My Blog Posts</Title>
                        </div>
                        
                        <div className="flex gap-3">
                            <Button
                                type="primary"
                                icon={<PlusOutlined />}
                                size="large"
                                onClick={() => {
                                    setFormData({ title: '', content: '' });
                                    setSelectedBlog(null);
                                    setIsModalOpen(true);
                                }}
                                className="flex items-center"
                            >
                                New Post
                            </Button>
                            
                            <Button
                                type="default"
                                danger
                                icon={<LogoutOutlined />}
                                size="large"
                                onClick={handleLogout}
                                className="flex items-center"
                            >
                                Logout
                            </Button>
                        </div>
                    </div>
                    
                    {loading ? (
                        <div className="flex justify-center items-center h-64">
                            <Spin size="large" tip="Loading your blogs..." />
                        </div>
                    ) : blogs.length === 0 ? (
                        <Empty 
                            description="No blog posts yet. Create your first post!" 
                            className="my-12"
                        />
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                            {blogs.map((blog) => (
                                <div 
                                    key={blog._id}
                                    className="transform transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
                                >
                                    <Card
                                        hoverable
                                        className="h-full"
                                        cover={
                                            <div 
                                                className="h-32 bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center"
                                            >
                                                <Title level={4} className="text-white m-0 p-4 text-center">
                                                    {blog.title}
                                                </Title>
                                            </div>
                                        }
                                        actions={[
                                            <EditOutlined key="edit" onClick={() => handleCardClick(blog)} />,
                                        ]}
                                    >
                                        <Paragraph className="h-24 overflow-hidden">
                                            {truncateContent(blog.content)}
                                        </Paragraph>
                                        <div className="flex justify-end mt-2">
                                            <Button 
                                                type="link" 
                                                onClick={() => handleCardClick(blog)}
                                            >
                                                Read More
                                            </Button>
                                        </div>
                                    </Card>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Modal for Adding or Editing Blogs */}
            <Modal
                title={
                    <div className="flex items-center">
                        {selectedBlog ? (
                            <>
                                <EditOutlined className="mr-2 text-blue-500" />
                                <span>Edit Blog Post</span>
                            </>
                        ) : (
                            <>
                                <PlusOutlined className="mr-2 text-green-500" />
                                <span>Create New Blog Post</span>
                            </>
                        )}
                    </div>
                }
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                footer={
                    selectedBlog ? (
                        <div className="flex justify-between">
                            <Button 
                                icon={<DeleteOutlined />} 
                                danger 
                                onClick={handleDelete}
                                loading={submitting}
                            >
                                Delete
                            </Button>
                            <Button 
                                type="primary" 
                                onClick={handleEdit}
                                loading={submitting}
                            >
                                Save Changes
                            </Button>
                        </div>
                    ) : (
                        <Button 
                            type="primary" 
                            onClick={handleUpload}
                            loading={submitting}
                        >
                            Publish Post
                        </Button>
                    )
                }
                width={600}
                centered
            >
                <div className="mb-4 mt-4">
                    <label className="block mb-2 text-sm font-medium text-gray-700">Title</label>
                    <Input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        placeholder="Enter an engaging title"
                        size="large"
                        maxLength={100}
                        showCount
                    />
                </div>
                <div className="mb-4">
                    <label className="block mb-2 text-sm font-medium text-gray-700">Content</label>
                    <Input.TextArea
                        name="content"
                        value={formData.content}
                        onChange={handleInputChange}
                        placeholder="Write your blog content here..."
                        rows={8}
                        size="large"
                        showCount
                        maxLength={5000}
                    />
                </div>
            </Modal>
        </div>
    );
};

export default Home;