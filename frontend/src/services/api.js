import { authenticatedFetch } from '../utils/auth';

export async function crearTrabajoPublicado(data) {
    const response = await authenticatedFetch('http://localhost:8000/api/trabajos-publicados/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });

    const json = await response.json().catch(() => null);
    if (!response.ok) {
        const err = json ? JSON.stringify(json) : `HTTP ${response.status}`;
        throw new Error(err);
    }

    return json;
}

export async function listarTrabajosPublicados() {
    const response = await authenticatedFetch('http://localhost:8000/api/trabajos-publicados/');
    const json = await response.json().catch(() => null);
    if (!response.ok) {
        const err = json ? JSON.stringify(json) : `HTTP ${response.status}`;
        throw new Error(err);
    }
    return json;
}

export async function crearPatente(data) {
    const response = await fetch('http://localhost:8000/api/patentes/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    const json = await response.json().catch(() => null);
    if (!response.ok) {
        const err = json ? JSON.stringify(json) : `HTTP ${response.status}`;
        throw new Error(err);
    }
    return json;
}

export async function listarGrupos() {
    const response = await authenticatedFetch('http://localhost:8000/api/grupos/');
    const json = await response.json().catch(() => null);
    if (!response.ok) {
        const err = json ? JSON.stringify(json) : `HTTP ${response.status}`;
        throw new Error(err);
    }
    return json;
}



export async function crearRegistro(data) {
        const response = await fetch('http://localhost:8000/api/registros/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    const json = await response.json().catch(() => null);
    if (!response.ok) {
        // throw the parsed json (if any) so the caller can display validation errors
        const err = json ? JSON.stringify(json) : `HTTP ${response.status}`;
        throw new Error(err);
    }
    return json;
}

export async function listarRegistros() {
        const response = await fetch('http://localhost:8000/api/registros/');
        const json = await response.json().catch(() => null);
        if (!response.ok) {
            const err = json ? JSON.stringify(json) : `HTTP ${response.status}`;
            throw new Error(err);
        }
        return json;
}
export async function listarPatentes() {
        const response = await fetch('http://localhost:8000/api/patentes/');
        const json = await response.json().catch(() => null);
        if (!response.ok) {
            const err = json ? JSON.stringify(json) : `HTTP ${response.status}`;
            throw new Error(err);
        }
        return json;
}

export async function listarTipoRegistros() {
    const response = await fetch('http://localhost:8000/api/tipo-registros/');
    const json = await response.json().catch(() => null);
    if (!response.ok) {
        const err = json ? JSON.stringify(json) : `HTTP ${response.status}`;
        throw new Error(err);
    }
    return json;
}

export async function crearTrabajoPresentado(data) {
    const response = await fetch('http://localhost:8000/api/trabajos-presentados/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    const json = await response.json().catch(() => null);
    if (!response.ok) {
        const err = json ? JSON.stringify(json) : `HTTP ${response.status}`;
        throw new Error(err);
    }
    return json;
}

export async function listarTrabajosPresentados() {
    const response = await fetch('http://localhost:8000/api/trabajos-presentados/');
    const json = await response.json().catch(() => null);
    if (!response.ok) {
        const err = json ? JSON.stringify(json) : `HTTP ${response.status}`;
        throw new Error(err);
    }
    return json;
}

export async function listarAutores() {
    const response = await authenticatedFetch('http://localhost:8000/api/autores/');
    const json = await response.json().catch(() => null);
    if (!response.ok) {
        const err = json ? JSON.stringify(json) : `HTTP ${response.status}`;
        throw new Error(err);
    }
    return json;
}

export async function crearAutor(data) {
    const response = await authenticatedFetch('http://localhost:8000/api/autores/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    const json = await response.json().catch(() => null);
    if (!response.ok) {
        const err = json ? JSON.stringify(json) : `HTTP ${response.status}`;
        throw new Error(err);
    }
    return json;
}

export async function listarTiposTrabajoPublicado() {
    const response = await authenticatedFetch('http://localhost:8000/api/tipo-trabajos-publicados/');
    const json = await response.json().catch(() => null);
    if (!response.ok) {
        const err = json ? JSON.stringify(json) : `HTTP ${response.status}`;
        throw new Error(err);
    }
    return json;
}