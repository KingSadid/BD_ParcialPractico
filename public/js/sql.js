// Health check on load
async function checkHealth() {
    try {
        const res = await fetch('/health');
        const data = await res.json();
        const status = data.databases.heritage.connected && data.databases.reservations.connected
            ? ' Conectado'
            : ' Error de conexión';
        document.getElementById('healthStatus').textContent = status;
    } catch (e) {
        document.getElementById('healthStatus').textContent = ' Sin conexión';
    }
}

// Helper to show results
function showResult(elementId, success, message, data = null) {
    const el = document.getElementById(elementId);
    el.className = `result ${success ? 'success' : 'error'}`;
    el.style.display = 'block';

    let html = `<strong>${success ? '' : ''} ${message}</strong>`;
    if (data) {
        html += `<pre>${JSON.stringify(data, null, 2)}</pre>`;
    }
    el.innerHTML = html;
}

// 1. Register Space
document.getElementById('formSpace').addEventListener('submit', async (e) => {
    e.preventDefault();

    const payload = {
        name: document.getElementById('spaceName').value,
        max_capacity: parseInt(document.getElementById('spaceCapacity').value),
        conservation_status: document.getElementById('spaceStatus').value,
        administrative_unit: document.getElementById('spaceUnit').value,
        address: document.getElementById('spaceAddress').value,
        description: document.getElementById('spaceDesc').value
    };

    try {
        const res = await fetch('/api/spaces', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const data = await res.json();
        showResult('resultSpace', data.success, data.success ? 'Espacio registrado' : 'Error', data.data);

        if (data.success) {
            e.target.reset();
            loadSpaces();
        }
    } catch (error) {
        showResult('resultSpace', false, 'Error de conexión: ' + error.message);
    }
});

// 2. Create Reservation
document.getElementById('formReservation').addEventListener('submit', async (e) => {
    e.preventDefault();

    const payload = {
        space_id: parseInt(document.getElementById('resSpaceId').value),
        requesting_organization: document.getElementById('resOrg').value,
        event_name: document.getElementById('resEvent').value,
        requested_capacity: parseInt(document.getElementById('resCapacity').value),
        start_datetime: document.getElementById('resStart').value,
        end_datetime: document.getElementById('resEnd').value
    };

    try {
        const res = await fetch('/api/reservations', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const data = await res.json();

        if (data.success) {
            showResult('resultReservation', true, 'Reserva creada exitosamente', data.data);
            e.target.reset();
        } else {
            showResult('resultReservation', false, 'Validación fallida', data.errors);
        }
    } catch (error) {
        showResult('resultReservation', false, 'Error de conexión: ' + error.message);
    }
});

// 3. Query Reservation
async function queryReservation() {
    const id = document.getElementById('queryResId').value;
    if (!id) return alert('Ingrese ID');

    try {
        const res = await fetch(`/api/reservations/${id}`);
        const data = await res.json();

        if (data.success) {
            const r = data.data;
            const history = r.status_history.map(h =>
                `${h.new_status} (${new Date(h.created_at).toLocaleString()})`
            ).join('\n');

            showResult('resultQuery', true, 'Reserva encontrada', {
                id: r.id,
                event: r.event_name,
                organization: r.requesting_organization,
                status: r.status,
                capacity: r.requested_capacity,
                dates: `${r.start_datetime} a ${r.end_datetime}`,
                history: history || 'Sin historial'
            });
        } else {
            showResult('resultQuery', false, data.message);
        }
    } catch (error) {
        showResult('resultQuery', false, 'Error: ' + error.message);
    }
}

// 4. Load Spaces
async function loadSpaces() {
    try {
        const res = await fetch('/api/spaces');
        const data = await res.json();

        const container = document.getElementById('listSpaces');
        if (!data.success || data.data.length === 0) {
            container.innerHTML = '<p>No hay espacios operativos</p>';
            return;
        }

        let html = '<table style="width:100%; border-collapse: collapse;">';
        html += '<tr style="background:#007bff; color:white"><th style="padding:8px">ID</th><th style="padding:8px">Nombre</th><th style="padding:8px">Capacidad</th><th style="padding:8px">Dirección</th></tr>';

        data.data.forEach(space => {
            html += `<tr style="border-bottom:1px solid #ddd">
                <td style="padding:8px">${space.id}</td>
                <td style="padding:8px">${space.name}</td>
                <td style="padding:8px">${space.max_capacity}</td>
                <td style="padding:8px">${space.address}</td>
            </tr>`;
        });
        html += '</table>';
        container.innerHTML = html;
    } catch (error) {
        document.getElementById('listSpaces').innerHTML = '<p>Error cargando espacios</p>';
    }
}

// Init
checkHealth();
setInterval(checkHealth, 30000);