'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import Profile from '@components/profile';

const UserProfile = ({ params }) => {
  const router = useRouter();

  const searchParams = useSearchParams();
  const userName = searchParams.get('name');

  console.log(params);

  const [userPosts, setUserPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const response = await fetch(`/api/users/${params.id}/posts`);
      const data = await response.json();

      setUserPosts(data);
    };

    if (params?.id) fetchPosts();
  }, [params.id]);

  const handleEdit = (post) => {
    router.push(`/update-prompt?id=${post._id}`);
  };

  const handleDelete = async (post) => {
    const hasConfirmed = confirm(
      'Are you sure you want to delete this prompt?'
    );

    if (hasConfirmed)
      try {
        await fetch(`/api/prompt/${post._id.toString()}`, {
          method: 'DELETE',
        });

        const filteredPosts = userPosts.filter((p) => p._id !== post._id);

        setUserPosts(filteredPosts);
      } catch (error) {
        console.log(error);
      }
  };

  return (
    <Profile
      name={userName}
      desc={`Welcome to ${userName}'s personalized profile page`}
      data={userPosts}
      handleEdit={handleEdit}
      handleDelete={handleDelete}
    />
  );
};

export default UserProfile;
