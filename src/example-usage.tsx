// Example: How to use React Query in your TanStack Router app

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'

// Example API function
const fetchPosts = async () => {
  const response = await fetch('/api/posts')
  if (!response.ok) throw new Error('Failed to fetch posts')
  return response.json()
}

const createPost = async (newPost: { title: string; content: string }) => {
  const response = await fetch('/api/posts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newPost),
  })
  if (!response.ok) throw new Error('Failed to create post')
  return response.json()
}

// Example route using React Query
export const Route = createFileRoute('/example')({
  component: ExampleComponent,
})

function ExampleComponent() {
  const queryClient = useQueryClient()

  // Fetch data with useQuery
  const { data: posts, isLoading, error } = useQuery({
    queryKey: ['posts'],
    queryFn: fetchPosts,
  })

  // Mutate data with useMutation
  const createPostMutation = useMutation({
    mutationFn: createPost,
    onSuccess: () => {
      // Invalidate and refetch posts after creating a new one
      queryClient.invalidateQueries({ queryKey: ['posts'] })
    },
  })

  const handleCreatePost = () => {
    createPostMutation.mutate({
      title: 'New Post',
      content: 'This is a new post created with React Query!',
    })
  }

  if (isLoading) return <div>Loading posts...</div>
  if (error) return <div>Error: {error.message}</div>

  return (
    <div>
      <h1>Posts</h1>
      <button
        onClick={handleCreatePost}
        disabled={createPostMutation.isPending}
      >
        {createPostMutation.isPending ? 'Creating...' : 'Create Post'}
      </button>

      <ul>
        {posts?.map((post: any) => (
          <li key={post.id}>
            <h3>{post.title}</h3>
            <p>{post.content}</p>
          </li>
        ))}
      </ul>
    </div>
  )
} 