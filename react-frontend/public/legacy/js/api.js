export async function get(url) {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`GET request failed: ${response.status}`);
    }
    return response.json();
}

export async function post(url, data) {
    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });

    if (!response.ok) {
        throw new Error(`POST request failed: ${response.status}`);
    }

    return response.json();
}

export async function put(url, data) {
    const response = await fetch(url, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });

    if (!response.ok) {
        throw new Error(`PUT request failed: ${response.status}`);
    }

    return response.json();
}

export async function remove(url) {
    const response = await fetch(url, {
        method: "DELETE"
    });

    if (!response.ok) {
        throw new Error(`DELETE request failed: ${response.status}`);
    }

    return response.json();
}