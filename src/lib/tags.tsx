// Assuming you have a function to call the API
export async function createTags (tags: string[], postId: string) {

  try {
    const response = await fetch(`${process.env.NEXTAUTH_URL}/api/tag`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ tags, postId }),
    });

    const data = await response.json();
    console.log(data);

    if (response.ok) {
      console.log('Tags created and updated:', data);
    } else {
      console.error('Error creating tags:', data.error);
    }
  } catch (error) {
    console.error('Unexpected error:', error);
  }
};


