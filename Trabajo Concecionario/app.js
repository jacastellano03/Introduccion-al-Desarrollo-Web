// ==================== CREDENCIALES DE ACCESO ====================
// Usuario y contraseña fijos para el login del sistema.
const USUARIO_VALIDO = "admin";
const PASSWORD_VALIDO = "123";
const NOMBRE_ARCHIVO_SUGERIDO = "Concesionaria_Autos_Lujo.xlsx";

// ==================== CLASES DEL SISTEMA ====================

class Cliente {
    constructor(apellidos, nombres, cedula, telefono, email, direccion) {
        this.apellidos = apellidos;
        this.nombres = nombres;
        this.cedula = cedula;
        this.telefono = telefono;
        this.email = email;
        this.direccion = direccion;
    }
}

class Vendedor {
    constructor(apellidos, nombres, cedula, telefono, email, zona) {
        this.apellidos = apellidos;
        this.nombres = nombres;
        this.cedula = cedula;
        this.telefono = telefono;
        this.email = email;
        this.zona = zona;
    }
}

class Auto {
    constructor(marca, modelo, anio, placa, color, precio, estado) {
        this.marca = marca;
        this.modelo = modelo;
        this.anio = anio;
        this.placa = placa;
        this.color = color;
        this.precio = precio;
        this.estado = estado; // Disponible, Reservado, Vendido
    }
}

class Transaccion {
    constructor(tipo, placaAuto, cedulaCliente, nombreCliente, cedulaVendedor, nombreVendedor, precio, fecha) {
        this.tipo = tipo; // Compra o Venta
        this.placaAuto = placaAuto;
        this.cedulaCliente = cedulaCliente;
        this.nombreCliente = nombreCliente;
        this.cedulaVendedor = cedulaVendedor;
        this.nombreVendedor = nombreVendedor;
        this.precio = precio;
        this.fecha = fecha;
    }
}

// Repuesto: partes y accesorios del auto (plumas, focos, paños, filtros, etc.)
class Repuesto {
    constructor(nombre, categoria, precio, stock) {
        this.nombre = nombre;
        this.categoria = categoria;
        this.precio = precio;
        this.stock = stock;
    }
}

// Venta de un repuesto a un cliente
class VentaRepuesto {
    constructor(nombreRepuesto, categoria, cantidad, precioUnitario, total, cedulaCliente, nombreCliente, cedulaVendedor, nombreVendedor, fecha) {
        this.nombreRepuesto = nombreRepuesto;
        this.categoria = categoria;
        this.cantidad = cantidad;
        this.precioUnitario = precioUnitario;
        this.total = total;
        this.cedulaCliente = cedulaCliente;
        this.nombreCliente = nombreCliente;
        this.cedulaVendedor = cedulaVendedor;
        this.nombreVendedor = nombreVendedor;
        this.fecha = fecha;
    }
}

class SistemaGestion {
    constructor() {
        this.listaClientes = [];
        this.listaVendedores = [];
        this.listaAutos = [];
        this.listaTransacciones = [];
        this.listaRepuestos = [];
        this.listaVentasRepuestos = [];
        this.fileHandle = null; // Enlace al archivo Excel vinculado en el disco
    }

    // ---------- CLIENTES ----------
    agregarCliente(apellidos, nombres, cedula, telefono, email, direccion) {
        const index = this.listaClientes.findIndex(c => c.cedula === cedula);
        const nuevo = new Cliente(apellidos, nombres, cedula, telefono, email, direccion);
        if (index === -1) {
            this.listaClientes.push(nuevo);
        } else {
            this.listaClientes[index] = nuevo;
        }
    }

    actualizarCliente(cedulaOriginal, apellidos, nombres, telefono, email, direccion) {
        const cli = this.listaClientes.find(c => c.cedula === cedulaOriginal);
        if (cli) {
            cli.apellidos = apellidos;
            cli.nombres = nombres;
            cli.telefono = telefono;
            cli.email = email;
            cli.direccion = direccion;
        }
    }

    eliminarCliente(cedula) {
        this.listaClientes = this.listaClientes.filter(c => c.cedula !== cedula);
    }

    // ---------- VENDEDORES ----------
    agregarVendedor(apellidos, nombres, cedula, telefono, email, zona) {
        const index = this.listaVendedores.findIndex(v => v.cedula === cedula);
        const nuevo = new Vendedor(apellidos, nombres, cedula, telefono, email, zona);
        if (index === -1) {
            this.listaVendedores.push(nuevo);
        } else {
            this.listaVendedores[index] = nuevo;
        }
    }

    actualizarVendedor(cedulaOriginal, apellidos, nombres, telefono, email, zona) {
        const ven = this.listaVendedores.find(v => v.cedula === cedulaOriginal);
        if (ven) {
            ven.apellidos = apellidos;
            ven.nombres = nombres;
            ven.telefono = telefono;
            ven.email = email;
            ven.zona = zona;
        }
    }

    eliminarVendedor(cedula) {
        this.listaVendedores = this.listaVendedores.filter(v => v.cedula !== cedula);
    }

    // ---------- AUTOS ----------
    agregarAuto(marca, modelo, anio, placa, color, precio, estado) {
        const index = this.listaAutos.findIndex(a => a.placa === placa);
        const nuevo = new Auto(marca, modelo, anio, placa, color, precio, estado);
        if (index === -1) {
            this.listaAutos.push(nuevo);
        } else {
            this.listaAutos[index] = nuevo;
        }
    }

    actualizarAuto(placaOriginal, marca, modelo, anio, color, precio, estado) {
        const auto = this.listaAutos.find(a => a.placa === placaOriginal);
        if (auto) {
            auto.marca = marca;
            auto.modelo = modelo;
            auto.anio = anio;
            auto.color = color;
            auto.precio = precio;
            auto.estado = estado;
        }
    }

    eliminarAuto(placa) {
        this.listaAutos = this.listaAutos.filter(a => a.placa !== placa);
    }

    // ---------- TRANSACCIONES DE AUTOS ----------
    agregarTransaccion(tipo, placaAuto, cedulaCliente, cedulaVendedor, precio, fecha) {
        const cliente = this.listaClientes.find(c => c.cedula === cedulaCliente);
        const vendedor = this.listaVendedores.find(v => v.cedula === cedulaVendedor);
        const nombreCliente = cliente ? `${cliente.nombres} ${cliente.apellidos}` : cedulaCliente;
        const nombreVendedor = vendedor ? `${vendedor.nombres} ${vendedor.apellidos}` : cedulaVendedor;

        this.listaTransacciones.push(new Transaccion(
            tipo, placaAuto, cedulaCliente, nombreCliente, cedulaVendedor, nombreVendedor, precio, fecha
        ));

        // Si es una Venta, el auto pasa a estado Vendido automáticamente
        const auto = this.listaAutos.find(a => a.placa === placaAuto);
        if (auto && tipo === 'Venta') {
            auto.estado = 'Vendido';
        } else if (auto && tipo === 'Compra') {
            auto.estado = 'Disponible';
        }
    }

    eliminarTransaccion(index) {
        this.listaTransacciones.splice(index, 1);
    }

    // ---------- REPUESTOS (plumas, focos, paños, filtros, etc.) ----------
    agregarRepuesto(nombre, categoria, precio, stock) {
        const index = this.listaRepuestos.findIndex(r => r.nombre.toLowerCase() === nombre.toLowerCase());
        const nuevo = new Repuesto(nombre, categoria, precio, stock);
        if (index === -1) {
            this.listaRepuestos.push(nuevo);
        } else {
            this.listaRepuestos[index] = nuevo;
        }
    }

    actualizarRepuesto(nombreOriginal, categoria, precio, stock) {
        const rep = this.listaRepuestos.find(r => r.nombre === nombreOriginal);
        if (rep) {
            rep.categoria = categoria;
            rep.precio = precio;
            rep.stock = stock;
        }
    }

    eliminarRepuesto(nombre) {
        this.listaRepuestos = this.listaRepuestos.filter(r => r.nombre !== nombre);
    }

    // ---------- VENTA DE REPUESTOS ----------
    agregarVentaRepuesto(nombreRepuesto, cantidad, cedulaCliente, cedulaVendedor, fecha) {
        const repuesto = this.listaRepuestos.find(r => r.nombre === nombreRepuesto);
        if (!repuesto) return false;

        const cant = Number(cantidad);
        if (cant > Number(repuesto.stock)) return 'SIN_STOCK';

        const cliente = this.listaClientes.find(c => c.cedula === cedulaCliente);
        const vendedor = this.listaVendedores.find(v => v.cedula === cedulaVendedor);
        const nombreCliente = cliente ? `${cliente.nombres} ${cliente.apellidos}` : cedulaCliente;
        const nombreVendedor = vendedor ? `${vendedor.nombres} ${vendedor.apellidos}` : cedulaVendedor;

        const precioUnitario = Number(repuesto.precio);
        const total = precioUnitario * cant;

        this.listaVentasRepuestos.push(new VentaRepuesto(
            repuesto.nombre, repuesto.categoria, cant, precioUnitario, total,
            cedulaCliente, nombreCliente, cedulaVendedor, nombreVendedor, fecha
        ));

        // Descontar del stock automáticamente
        repuesto.stock = Number(repuesto.stock) - cant;

        return true;
    }

    eliminarVentaRepuesto(index) {
        this.listaVentasRepuestos.splice(index, 1);
    }

    // ---------- CARGA DESDE ARCHIVO EXCEL ----------
    async cargarDesdeArchivo(file) {
        const arrayBuffer = await file.arrayBuffer();
        const workbook = XLSX.read(arrayBuffer, { type: 'array' });

        this.listaClientes = [];
        this.listaVendedores = [];
        this.listaAutos = [];
        this.listaTransacciones = [];
        this.listaRepuestos = [];
        this.listaVentasRepuestos = [];

        if (workbook.Sheets["Clientes"]) {
            const jsonClientes = XLSX.utils.sheet_to_json(workbook.Sheets["Clientes"], { defval: "" });
            jsonClientes.forEach(row => {
                this.listaClientes.push(new Cliente(
                    String(row["Apellidos"] || ''),
                    String(row["Nombres"] || ''),
                    String(row["Cédula"] || ''),
                    String(row["Teléfono"] || ''),
                    String(row["Email"] || ''),
                    String(row["Dirección"] || '')
                ));
            });
        }

        if (workbook.Sheets["Vendedores"]) {
            const jsonVendedores = XLSX.utils.sheet_to_json(workbook.Sheets["Vendedores"], { defval: "" });
            jsonVendedores.forEach(row => {
                this.listaVendedores.push(new Vendedor(
                    String(row["Apellidos"] || ''),
                    String(row["Nombres"] || ''),
                    String(row["Cédula"] || ''),
                    String(row["Teléfono"] || ''),
                    String(row["Email"] || ''),
                    String(row["Zona"] || '')
                ));
            });
        }

        if (workbook.Sheets["Autos"]) {
            const jsonAutos = XLSX.utils.sheet_to_json(workbook.Sheets["Autos"], { defval: "" });
            jsonAutos.forEach(row => {
                this.listaAutos.push(new Auto(
                    String(row["Marca"] || ''),
                    String(row["Modelo"] || ''),
                    String(row["Año"] || ''),
                    String(row["Placa"] || ''),
                    String(row["Color"] || ''),
                    String(row["Precio"] || ''),
                    String(row["Estado"] || 'Disponible')
                ));
            });
        }

        if (workbook.Sheets["Transacciones"]) {
            const jsonTrans = XLSX.utils.sheet_to_json(workbook.Sheets["Transacciones"], { defval: "" });
            jsonTrans.forEach(row => {
                this.listaTransacciones.push(new Transaccion(
                    String(row["Tipo"] || ''),
                    String(row["Placa Auto"] || ''),
                    String(row["Cédula Cliente"] || ''),
                    String(row["Cliente"] || ''),
                    String(row["Cédula Vendedor"] || ''),
                    String(row["Vendedor"] || ''),
                    String(row["Precio"] || ''),
                    String(row["Fecha"] || '')
                ));
            });
        }

        if (workbook.Sheets["Repuestos"]) {
            const jsonRepuestos = XLSX.utils.sheet_to_json(workbook.Sheets["Repuestos"], { defval: "" });
            jsonRepuestos.forEach(row => {
                this.listaRepuestos.push(new Repuesto(
                    String(row["Nombre"] || ''),
                    String(row["Categoría"] || ''),
                    String(row["Precio"] || ''),
                    String(row["Stock"] || '')
                ));
            });
        }

        if (workbook.Sheets["VentasRepuestos"]) {
            const jsonVentas = XLSX.utils.sheet_to_json(workbook.Sheets["VentasRepuestos"], { defval: "" });
            jsonVentas.forEach(row => {
                this.listaVentasRepuestos.push(new VentaRepuesto(
                    String(row["Repuesto"] || ''),
                    String(row["Categoría"] || ''),
                    String(row["Cantidad"] || ''),
                    String(row["Precio Unitario"] || ''),
                    String(row["Total"] || ''),
                    String(row["Cédula Cliente"] || ''),
                    String(row["Cliente"] || ''),
                    String(row["Cédula Vendedor"] || ''),
                    String(row["Vendedor"] || ''),
                    String(row["Fecha"] || '')
                ));
            });
        }
    }

    // ---------- GENERAR LIBRO EXCEL (6 hojas) ----------
    generarWorkbook() {
        const wb = XLSX.utils.book_new();

        const datosClientes = [
            ["Apellidos", "Nombres", "Cédula", "Teléfono", "Email", "Dirección"],
            ...this.listaClientes.map(c => [c.apellidos, c.nombres, c.cedula, c.telefono, c.email, c.direccion])
        ];
        XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(datosClientes), "Clientes");

        const datosVendedores = [
            ["Apellidos", "Nombres", "Cédula", "Teléfono", "Email", "Zona"],
            ...this.listaVendedores.map(v => [v.apellidos, v.nombres, v.cedula, v.telefono, v.email, v.zona])
        ];
        XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(datosVendedores), "Vendedores");

        const datosAutos = [
            ["Marca", "Modelo", "Año", "Placa", "Color", "Precio", "Estado"],
            ...this.listaAutos.map(a => [a.marca, a.modelo, a.anio, a.placa, a.color, a.precio, a.estado])
        ];
        XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(datosAutos), "Autos");

        const datosTransacciones = [
            ["Tipo", "Placa Auto", "Cédula Cliente", "Cliente", "Cédula Vendedor", "Vendedor", "Precio", "Fecha"],
            ...this.listaTransacciones.map(t => [t.tipo, t.placaAuto, t.cedulaCliente, t.nombreCliente, t.cedulaVendedor, t.nombreVendedor, t.precio, t.fecha])
        ];
        XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(datosTransacciones), "Transacciones");

        const datosRepuestos = [
            ["Nombre", "Categoría", "Precio", "Stock"],
            ...this.listaRepuestos.map(r => [r.nombre, r.categoria, r.precio, r.stock])
        ];
        XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(datosRepuestos), "Repuestos");

        const datosVentasRepuestos = [
            ["Repuesto", "Categoría", "Cantidad", "Precio Unitario", "Total", "Cédula Cliente", "Cliente", "Cédula Vendedor", "Vendedor", "Fecha"],
            ...this.listaVentasRepuestos.map(v => [v.nombreRepuesto, v.categoria, v.cantidad, v.precioUnitario, v.total, v.cedulaCliente, v.nombreCliente, v.cedulaVendedor, v.nombreVendedor, v.fecha])
        ];
        XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(datosVentasRepuestos), "VentasRepuestos");

        return wb;
    }

    // ---------- ESCRIBIR EN DISCO (usa el fileHandle ya vinculado) ----------
    async guardarEnDisco() {
        const wb = this.generarWorkbook();
        const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        const writable = await this.fileHandle.createWritable();
        await writable.write(excelBuffer);
        await writable.close();
    }
}

// ==================== CONTROLADOR DE LA INTERFAZ (UI) ====================

class UIController {
    constructor() {
        this.sistema = new SistemaGestion();
        this.modoEdicionClienteCedula = null;
        this.modoEdicionVendedorCedula = null;
        this.modoEdicionAutoPlaca = null;
        this.modoEdicionRepuestoNombre = null;
        this.soportaFileSystemAPI = 'showSaveFilePicker' in window;
        this.initEventosLogin();
        this.initEventosApp();
        this.actualizarContadores();

        if (!this.soportaFileSystemAPI) {
            document.getElementById('fileStatusMsg').textContent =
                "Estado: Tu navegador no soporta guardado automático directo (usa Chrome o Edge). Los cambios se mantendrán en memoria y podrás descargar el Excel manualmente.";
            document.getElementById('fileStatusMsg').style.color = "#c0392b";
        }
    }

    // ---------- LOGIN ----------
    initEventosLogin() {
        document.getElementById('formLogin').addEventListener('submit', (e) => {
            e.preventDefault();
            const usuario = document.getElementById('loginUsuario').value.trim();
            const password = document.getElementById('loginPassword').value.trim();

            if (usuario === USUARIO_VALIDO && password === PASSWORD_VALIDO) {
                document.getElementById('pantallaLogin').style.display = 'none';
                document.getElementById('pantallaApp').style.display = 'block';
                document.getElementById('usuarioActivo').textContent = `Usuario: ${usuario}`;
                document.getElementById('loginErrorMsg').textContent = '';
                document.getElementById('formLogin').reset();
            } else {
                document.getElementById('loginErrorMsg').textContent = 'Usuario o contraseña incorrectos.';
            }
        });

        document.getElementById('btnLogout').addEventListener('click', () => {
            document.getElementById('pantallaApp').style.display = 'none';
            document.getElementById('pantallaLogin').style.display = 'block';
        });
    }

    // ---------- NAVEGACIÓN DE PESTAÑAS ----------
    cambiarPestana(pestana) {
        document.querySelectorAll('.sheet').forEach(s => s.classList.remove('active'));
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));

        const mapa = {
            'clienteForm': 0, 'clientes': 1,
            'vendedorForm': 2, 'vendedores': 3,
            'autoForm': 4, 'autos': 5,
            'transaccionForm': 6, 'transacciones': 7,
            'repuestoForm': 8, 'repuestos': 9,
            'ventaRepuestoForm': 10, 'ventasRepuestos': 11
        };

        document.getElementById(`seccion-${pestana}`).classList.add('active');
        document.querySelectorAll('.tab-btn')[mapa[pestana]].classList.add('active');

        if (pestana === 'clientes') this.renderTablaClientes();
        if (pestana === 'vendedores') this.renderTablaVendedores();
        if (pestana === 'autos') this.renderTablaAutos();
        if (pestana === 'transacciones') this.renderTablaTransacciones();
        if (pestana === 'repuestos') this.renderTablaRepuestos();
        if (pestana === 'ventasRepuestos') this.renderTablaVentasRepuestos();
        if (pestana === 'transaccionForm') this.poblarSelectsTransaccion();
        if (pestana === 'ventaRepuestoForm') this.poblarSelectsVentaRepuesto();
    }

    // ---------- RENDER TABLAS ----------
    renderTablaClientes() {
        const tbody = document.querySelector('#tablaClientes tbody');
        tbody.innerHTML = '';
        if (this.sistema.listaClientes.length === 0) {
            tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; color:#7f8c8d;">No hay clientes registrados.</td></tr>`;
            return;
        }
        this.sistema.listaClientes.forEach((c) => {
            tbody.innerHTML += `
                <tr>
                    <td>${c.apellidos}</td>
                    <td>${c.nombres}</td>
                    <td>${c.cedula}</td>
                    <td>${c.telefono || '-'}</td>
                    <td>${c.email || '-'}</td>
                    <td>${c.direccion || '-'}</td>
                    <td>
                        <button class="btn-action btn-edit" onclick="appUI.cargarClienteParaEditar('${c.cedula}')">✏️ Editar</button>
                        <button class="btn-action btn-delete" onclick="appUI.eliminarCliente('${c.cedula}')">🗑️ Eliminar</button>
                    </td>
                </tr>`;
        });
    }

    renderTablaVendedores() {
        const tbody = document.querySelector('#tablaVendedores tbody');
        tbody.innerHTML = '';
        if (this.sistema.listaVendedores.length === 0) {
            tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; color:#7f8c8d;">No hay vendedores registrados.</td></tr>`;
            return;
        }
        this.sistema.listaVendedores.forEach((v) => {
            tbody.innerHTML += `
                <tr>
                    <td>${v.apellidos}</td>
                    <td>${v.nombres}</td>
                    <td>${v.cedula}</td>
                    <td>${v.telefono || '-'}</td>
                    <td>${v.email || '-'}</td>
                    <td>${v.zona || '-'}</td>
                    <td>
                        <button class="btn-action btn-edit" onclick="appUI.cargarVendedorParaEditar('${v.cedula}')">✏️ Editar</button>
                        <button class="btn-action btn-delete" onclick="appUI.eliminarVendedor('${v.cedula}')">🗑️ Eliminar</button>
                    </td>
                </tr>`;
        });
    }

    renderTablaAutos() {
        const tbody = document.querySelector('#tablaAutos tbody');
        tbody.innerHTML = '';
        if (this.sistema.listaAutos.length === 0) {
            tbody.innerHTML = `<tr><td colspan="8" style="text-align:center; color:#7f8c8d;">No hay autos registrados.</td></tr>`;
            return;
        }
        this.sistema.listaAutos.forEach((a) => {
            tbody.innerHTML += `
                <tr>
                    <td>${a.marca}</td>
                    <td>${a.modelo}</td>
                    <td>${a.anio}</td>
                    <td>${a.placa}</td>
                    <td>${a.color || '-'}</td>
                    <td>$${Number(a.precio).toLocaleString()}</td>
                    <td>${a.estado}</td>
                    <td>
                        <button class="btn-action btn-edit" onclick="appUI.cargarAutoParaEditar('${a.placa}')">✏️ Editar</button>
                        <button class="btn-action btn-delete" onclick="appUI.eliminarAuto('${a.placa}')">🗑️ Eliminar</button>
                    </td>
                </tr>`;
        });
    }

    renderTablaTransacciones() {
        const tbody = document.querySelector('#tablaTransacciones tbody');
        tbody.innerHTML = '';
        if (this.sistema.listaTransacciones.length === 0) {
            tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; color:#7f8c8d;">No hay transacciones registradas.</td></tr>`;
            return;
        }
        this.sistema.listaTransacciones.forEach((t, index) => {
            tbody.innerHTML += `
                <tr>
                    <td>${t.tipo}</td>
                    <td>${t.placaAuto}</td>
                    <td>${t.nombreCliente}</td>
                    <td>${t.nombreVendedor}</td>
                    <td>$${Number(t.precio).toLocaleString()}</td>
                    <td>${t.fecha}</td>
                    <td>
                        <button class="btn-action btn-delete" onclick="appUI.eliminarTransaccion(${index})">🗑️ Eliminar</button>
                    </td>
                </tr>`;
        });
    }

    renderTablaRepuestos() {
        const tbody = document.querySelector('#tablaRepuestos tbody');
        tbody.innerHTML = '';
        if (this.sistema.listaRepuestos.length === 0) {
            tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; color:#7f8c8d;">No hay repuestos registrados.</td></tr>`;
            return;
        }
        this.sistema.listaRepuestos.forEach((r) => {
            tbody.innerHTML += `
                <tr>
                    <td>${r.nombre}</td>
                    <td>${r.categoria}</td>
                    <td>$${Number(r.precio).toLocaleString()}</td>
                    <td>${r.stock}</td>
                    <td>
                        <button class="btn-action btn-edit" onclick="appUI.cargarRepuestoParaEditar('${r.nombre}')">✏️ Editar</button>
                        <button class="btn-action btn-delete" onclick="appUI.eliminarRepuesto('${r.nombre}')">🗑️ Eliminar</button>
                    </td>
                </tr>`;
        });
    }

    renderTablaVentasRepuestos() {
        const tbody = document.querySelector('#tablaVentasRepuestos tbody');
        tbody.innerHTML = '';
        if (this.sistema.listaVentasRepuestos.length === 0) {
            tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; color:#7f8c8d;">No hay ventas de repuestos registradas.</td></tr>`;
            return;
        }
        this.sistema.listaVentasRepuestos.forEach((v, index) => {
            tbody.innerHTML += `
                <tr>
                    <td>${v.nombreRepuesto} (${v.categoria})</td>
                    <td>${v.cantidad}</td>
                    <td>$${Number(v.total).toLocaleString()}</td>
                    <td>${v.nombreCliente}</td>
                    <td>${v.nombreVendedor}</td>
                    <td>${v.fecha}</td>
                    <td>
                        <button class="btn-action btn-delete" onclick="appUI.eliminarVentaRepuesto(${index})">🗑️ Eliminar</button>
                    </td>
                </tr>`;
        });
    }

    // Llena los selects del formulario de transacción de auto
    poblarSelectsTransaccion() {
        const selectAuto = document.getElementById('transaccionPlacaAuto');
        const selectCliente = document.getElementById('transaccionCliente');
        const selectVendedor = document.getElementById('transaccionVendedor');

        selectAuto.innerHTML = '<option value="">Seleccione un auto...</option>';
        this.sistema.listaAutos.forEach(a => {
            selectAuto.innerHTML += `<option value="${a.placa}">${a.marca} ${a.modelo} (${a.placa})</option>`;
        });

        selectCliente.innerHTML = '<option value="">Seleccione un cliente...</option>';
        this.sistema.listaClientes.forEach(c => {
            selectCliente.innerHTML += `<option value="${c.cedula}">${c.nombres} ${c.apellidos} (${c.cedula})</option>`;
        });

        selectVendedor.innerHTML = '<option value="">Seleccione un vendedor...</option>';
        this.sistema.listaVendedores.forEach(v => {
            selectVendedor.innerHTML += `<option value="${v.cedula}">${v.nombres} ${v.apellidos} (${v.cedula})</option>`;
        });
    }

    // Llena los selects del formulario de venta de repuesto
    poblarSelectsVentaRepuesto() {
        const selectRepuesto = document.getElementById('ventaRepuestoNombre');
        const selectCliente = document.getElementById('ventaRepuestoCliente');
        const selectVendedor = document.getElementById('ventaRepuestoVendedor');

        selectRepuesto.innerHTML = '<option value="">Seleccione un repuesto...</option>';
        this.sistema.listaRepuestos.forEach(r => {
            selectRepuesto.innerHTML += `<option value="${r.nombre}">${r.nombre} - ${r.categoria} ($${r.precio}) — Stock: ${r.stock}</option>`;
        });

        selectCliente.innerHTML = '<option value="">Seleccione un cliente...</option>';
        this.sistema.listaClientes.forEach(c => {
            selectCliente.innerHTML += `<option value="${c.cedula}">${c.nombres} ${c.apellidos} (${c.cedula})</option>`;
        });

        selectVendedor.innerHTML = '<option value="">Seleccione un vendedor...</option>';
        this.sistema.listaVendedores.forEach(v => {
            selectVendedor.innerHTML += `<option value="${v.cedula}">${v.nombres} ${v.apellidos} (${v.cedula})</option>`;
        });
    }

    // ---------- EDICIÓN CLIENTE ----------
    cargarClienteParaEditar(cedula) {
        const cliente = this.sistema.listaClientes.find(c => c.cedula === cedula);
        if (!cliente) return;

        document.getElementById('clienteApellidos').value = cliente.apellidos;
        document.getElementById('clienteNombres').value = cliente.nombres;
        document.getElementById('clienteCedula').value = cliente.cedula;
        document.getElementById('clienteCedula').disabled = true;
        document.getElementById('clienteTelefono').value = cliente.telefono;
        document.getElementById('clienteEmail').value = cliente.email;
        document.getElementById('clienteDireccion').value = cliente.direccion;

        document.getElementById('clienteFormTitle').textContent = `Editando cliente: ${cliente.nombres} ${cliente.apellidos}`;
        document.getElementById('btnSubmitCliente').textContent = "💾 Guardar Cambios";

        this.modoEdicionClienteCedula = cedula;
        this.cambiarPestana('clienteForm');
    }

    resetearFormularioCliente() {
        document.getElementById('formCliente').reset();
        document.getElementById('clienteCedula').disabled = false;
        document.getElementById('clienteFormTitle').textContent = "Nuevo Cliente";
        document.getElementById('btnSubmitCliente').textContent = "➕ Registrar Cliente";
        this.modoEdicionClienteCedula = null;
    }

    async eliminarCliente(cedula) {
        if (confirm(`¿Eliminar al cliente con cédula ${cedula}?`)) {
            this.sistema.eliminarCliente(cedula);
            this.actualizarContadores();
            this.renderTablaClientes();
            await this.guardarAutomatico();
        }
    }

    // ---------- EDICIÓN VENDEDOR ----------
    cargarVendedorParaEditar(cedula) {
        const vendedor = this.sistema.listaVendedores.find(v => v.cedula === cedula);
        if (!vendedor) return;

        document.getElementById('vendedorApellidos').value = vendedor.apellidos;
        document.getElementById('vendedorNombres').value = vendedor.nombres;
        document.getElementById('vendedorCedula').value = vendedor.cedula;
        document.getElementById('vendedorCedula').disabled = true;
        document.getElementById('vendedorTelefono').value = vendedor.telefono;
        document.getElementById('vendedorEmail').value = vendedor.email;
        document.getElementById('vendedorZona').value = vendedor.zona;

        document.getElementById('vendedorFormTitle').textContent = `Editando vendedor: ${vendedor.nombres} ${vendedor.apellidos}`;
        document.getElementById('btnSubmitVendedor').textContent = "💾 Guardar Cambios";

        this.modoEdicionVendedorCedula = cedula;
        this.cambiarPestana('vendedorForm');
    }

    resetearFormularioVendedor() {
        document.getElementById('formVendedor').reset();
        document.getElementById('vendedorCedula').disabled = false;
        document.getElementById('vendedorFormTitle').textContent = "Nuevo Vendedor";
        document.getElementById('btnSubmitVendedor').textContent = "➕ Registrar Vendedor";
        this.modoEdicionVendedorCedula = null;
    }

    async eliminarVendedor(cedula) {
        if (confirm(`¿Eliminar al vendedor con cédula ${cedula}?`)) {
            this.sistema.eliminarVendedor(cedula);
            this.actualizarContadores();
            this.renderTablaVendedores();
            await this.guardarAutomatico();
        }
    }

    // ---------- EDICIÓN AUTO ----------
    cargarAutoParaEditar(placa) {
        const auto = this.sistema.listaAutos.find(a => a.placa === placa);
        if (!auto) return;

        document.getElementById('autoMarca').value = auto.marca;
        document.getElementById('autoModelo').value = auto.modelo;
        document.getElementById('autoAnio').value = auto.anio;
        document.getElementById('autoPlaca').value = auto.placa;
        document.getElementById('autoPlaca').disabled = true;
        document.getElementById('autoColor').value = auto.color;
        document.getElementById('autoPrecio').value = auto.precio;
        document.getElementById('autoEstado').value = auto.estado;

        document.getElementById('autoFormTitle').textContent = `Editando auto: ${auto.marca} ${auto.modelo}`;
        document.getElementById('btnSubmitAuto').textContent = "💾 Guardar Cambios";

        this.modoEdicionAutoPlaca = placa;
        this.cambiarPestana('autoForm');
    }

    resetearFormularioAuto() {
        document.getElementById('formAuto').reset();
        document.getElementById('autoPlaca').disabled = false;
        document.getElementById('autoFormTitle').textContent = "Nuevo Auto";
        document.getElementById('btnSubmitAuto').textContent = "➕ Registrar Auto";
        this.modoEdicionAutoPlaca = null;
    }

    async eliminarAuto(placa) {
        if (confirm(`¿Eliminar el auto con placa ${placa}?`)) {
            this.sistema.eliminarAuto(placa);
            this.actualizarContadores();
            this.renderTablaAutos();
            await this.guardarAutomatico();
        }
    }

    async eliminarTransaccion(index) {
        if (confirm("¿Eliminar esta transacción?")) {
            this.sistema.eliminarTransaccion(index);
            this.actualizarContadores();
            this.renderTablaTransacciones();
            await this.guardarAutomatico();
        }
    }

    // ---------- EDICIÓN REPUESTO ----------
    cargarRepuestoParaEditar(nombre) {
        const rep = this.sistema.listaRepuestos.find(r => r.nombre === nombre);
        if (!rep) return;

        document.getElementById('repuestoNombre').value = rep.nombre;
        document.getElementById('repuestoNombre').disabled = true;
        document.getElementById('repuestoCategoria').value = rep.categoria;
        document.getElementById('repuestoPrecio').value = rep.precio;
        document.getElementById('repuestoStock').value = rep.stock;

        document.getElementById('repuestoFormTitle').textContent = `Editando repuesto: ${rep.nombre}`;
        document.getElementById('btnSubmitRepuesto').textContent = "💾 Guardar Cambios";

        this.modoEdicionRepuestoNombre = nombre;
        this.cambiarPestana('repuestoForm');
    }

    resetearFormularioRepuesto() {
        document.getElementById('formRepuesto').reset();
        document.getElementById('repuestoNombre').disabled = false;
        document.getElementById('repuestoFormTitle').textContent = "Nuevo Repuesto";
        document.getElementById('btnSubmitRepuesto').textContent = "➕ Registrar Repuesto";
        this.modoEdicionRepuestoNombre = null;
    }

    async eliminarRepuesto(nombre) {
        if (confirm(`¿Eliminar el repuesto "${nombre}"?`)) {
            this.sistema.eliminarRepuesto(nombre);
            this.actualizarContadores();
            this.renderTablaRepuestos();
            await this.guardarAutomatico();
        }
    }

    async eliminarVentaRepuesto(index) {
        if (confirm("¿Eliminar esta venta de repuesto?")) {
            this.sistema.eliminarVentaRepuesto(index);
            this.actualizarContadores();
            this.renderTablaVentasRepuestos();
            await this.guardarAutomatico();
        }
    }

    // ---------- UTILIDADES ----------
    actualizarContadores() {
        document.getElementById('countClientes').textContent = this.sistema.listaClientes.length;
        document.getElementById('countVendedores').textContent = this.sistema.listaVendedores.length;
        document.getElementById('countAutos').textContent = this.sistema.listaAutos.length;
        document.getElementById('countTransacciones').textContent = this.sistema.listaTransacciones.length;
        document.getElementById('countRepuestos').textContent = this.sistema.listaRepuestos.length;
        document.getElementById('countVentasRepuestos').textContent = this.sistema.listaVentasRepuestos.length;
    }

    // Guarda automáticamente en el archivo Excel vinculado.
    // Si todavía no hay archivo vinculado, pide crear/elegir uno (esto ocurre
    // dentro del propio evento del usuario, así que el navegador lo permite).
    async guardarAutomatico() {
        if (!this.soportaFileSystemAPI) {
            document.getElementById('fileStatusMsg').textContent =
                "Estado: Cambios guardados en memoria. Tu navegador no permite guardar directo en disco; usa 'Descargar Excel' para exportar.";
            document.getElementById('fileStatusMsg').style.color = "#c0392b";
            document.getElementById('btnGuardar').disabled = false;
            return;
        }

        try {
            if (!this.sistema.fileHandle) {
                this.sistema.fileHandle = await window.showSaveFilePicker({
                    suggestedName: NOMBRE_ARCHIVO_SUGERIDO,
                    types: [{ description: 'Archivos Excel', accept: { 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'] } }]
                });
            }

            await this.sistema.guardarEnDisco();

            document.getElementById('btnGuardar').disabled = false;
            document.getElementById('fileStatusMsg').textContent = "Estado: Guardado automáticamente en tu archivo Excel. ✅";
            document.getElementById('fileStatusMsg').style.color = "#27ae60";
        } catch (error) {
            if (error.name !== 'AbortError') {
                console.error(error);
                document.getElementById('fileStatusMsg').textContent = "Estado: No se pudo guardar automáticamente. Usa el botón 'Actualizar Excel'.";
                document.getElementById('fileStatusMsg').style.color = "#c0392b";
            }
        }
    }

    // ---------- EVENTOS DE LA APP ----------
    initEventosApp() {
        // Formulario Cliente
        document.getElementById('formCliente').addEventListener('submit', async (e) => {
            e.preventDefault();

            const apellidos = document.getElementById('clienteApellidos').value.trim();
            const nombres = document.getElementById('clienteNombres').value.trim();
            const cedula = document.getElementById('clienteCedula').value.trim();
            const telefono = document.getElementById('clienteTelefono').value.trim();
            const email = document.getElementById('clienteEmail').value.trim();
            const direccion = document.getElementById('clienteDireccion').value.trim();

            if (this.modoEdicionClienteCedula) {
                this.sistema.actualizarCliente(this.modoEdicionClienteCedula, apellidos, nombres, telefono, email, direccion);
            } else {
                this.sistema.agregarCliente(apellidos, nombres, cedula, telefono, email, direccion);
            }

            this.resetearFormularioCliente();
            this.actualizarContadores();
            this.cambiarPestana('clientes');
            await this.guardarAutomatico();
        });

        // Formulario Vendedor
        document.getElementById('formVendedor').addEventListener('submit', async (e) => {
            e.preventDefault();

            const apellidos = document.getElementById('vendedorApellidos').value.trim();
            const nombres = document.getElementById('vendedorNombres').value.trim();
            const cedula = document.getElementById('vendedorCedula').value.trim();
            const telefono = document.getElementById('vendedorTelefono').value.trim();
            const email = document.getElementById('vendedorEmail').value.trim();
            const zona = document.getElementById('vendedorZona').value.trim();

            if (this.modoEdicionVendedorCedula) {
                this.sistema.actualizarVendedor(this.modoEdicionVendedorCedula, apellidos, nombres, telefono, email, zona);
            } else {
                this.sistema.agregarVendedor(apellidos, nombres, cedula, telefono, email, zona);
            }

            this.resetearFormularioVendedor();
            this.actualizarContadores();
            this.cambiarPestana('vendedores');
            await this.guardarAutomatico();
        });

        // Formulario Auto
        document.getElementById('formAuto').addEventListener('submit', async (e) => {
            e.preventDefault();

            const marca = document.getElementById('autoMarca').value.trim();
            const modelo = document.getElementById('autoModelo').value.trim();
            const anio = document.getElementById('autoAnio').value.trim();
            const placa = document.getElementById('autoPlaca').value.trim();
            const color = document.getElementById('autoColor').value.trim();
            const precio = document.getElementById('autoPrecio').value.trim();
            const estado = document.getElementById('autoEstado').value;

            if (this.modoEdicionAutoPlaca) {
                this.sistema.actualizarAuto(this.modoEdicionAutoPlaca, marca, modelo, anio, color, precio, estado);
            } else {
                this.sistema.agregarAuto(marca, modelo, anio, placa, color, precio, estado);
            }

            this.resetearFormularioAuto();
            this.actualizarContadores();
            this.cambiarPestana('autos');
            await this.guardarAutomatico();
        });

        // Formulario Transacción de Auto (Compra o Venta)
        document.getElementById('formTransaccion').addEventListener('submit', async (e) => {
            e.preventDefault();

            const tipo = document.getElementById('transaccionTipo').value;
            const placaAuto = document.getElementById('transaccionPlacaAuto').value;
            const cedulaCliente = document.getElementById('transaccionCliente').value;
            const cedulaVendedor = document.getElementById('transaccionVendedor').value;
            const precio = document.getElementById('transaccionPrecio').value.trim();
            const fecha = document.getElementById('transaccionFecha').value;

            if (!placaAuto || !cedulaCliente || !cedulaVendedor) {
                alert("Por favor seleccione auto, cliente y vendedor.");
                return;
            }

            this.sistema.agregarTransaccion(tipo, placaAuto, cedulaCliente, cedulaVendedor, precio, fecha);

            document.getElementById('formTransaccion').reset();
            this.actualizarContadores();
            this.renderTablaAutos();
            this.cambiarPestana('transacciones');
            await this.guardarAutomatico();
        });

        // Formulario Repuesto
        document.getElementById('formRepuesto').addEventListener('submit', async (e) => {
            e.preventDefault();

            const nombre = document.getElementById('repuestoNombre').value.trim();
            const categoria = document.getElementById('repuestoCategoria').value;
            const precio = document.getElementById('repuestoPrecio').value.trim();
            const stock = document.getElementById('repuestoStock').value.trim();

            if (this.modoEdicionRepuestoNombre) {
                this.sistema.actualizarRepuesto(this.modoEdicionRepuestoNombre, categoria, precio, stock);
            } else {
                this.sistema.agregarRepuesto(nombre, categoria, precio, stock);
            }

            this.resetearFormularioRepuesto();
            this.actualizarContadores();
            this.cambiarPestana('repuestos');
            await this.guardarAutomatico();
        });

        // Formulario Venta de Repuesto
        document.getElementById('formVentaRepuesto').addEventListener('submit', async (e) => {
            e.preventDefault();

            const nombreRepuesto = document.getElementById('ventaRepuestoNombre').value;
            const cantidad = document.getElementById('ventaRepuestoCantidad').value.trim();
            const cedulaCliente = document.getElementById('ventaRepuestoCliente').value;
            const cedulaVendedor = document.getElementById('ventaRepuestoVendedor').value;
            const fecha = document.getElementById('ventaRepuestoFecha').value;

            if (!nombreRepuesto || !cedulaCliente || !cedulaVendedor) {
                alert("Por favor seleccione repuesto, cliente y vendedor.");
                return;
            }

            const resultado = this.sistema.agregarVentaRepuesto(nombreRepuesto, cantidad, cedulaCliente, cedulaVendedor, fecha);

            if (resultado === 'SIN_STOCK') {
                alert("No hay suficiente stock de ese repuesto para esta cantidad.");
                return;
            }

            document.getElementById('formVentaRepuesto').reset();
            this.actualizarContadores();
            this.renderTablaRepuestos();
            this.cambiarPestana('ventasRepuestos');
            await this.guardarAutomatico();
        });

        // Cargar archivo Excel existente (permite seguir agregando sin perder lo anterior)
        document.getElementById('btnCargar').addEventListener('click', async () => {
            try {
                const [handle] = await window.showOpenFilePicker({
                    types: [{ description: 'Archivos Excel', accept: { 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'] } }]
                });

                this.sistema.fileHandle = handle;
                const file = await handle.getFile();

                await this.sistema.cargarDesdeArchivo(file);
                this.actualizarContadores();
                this.renderTablaClientes();
                this.renderTablaVendedores();
                this.renderTablaAutos();
                this.renderTablaTransacciones();
                this.renderTablaRepuestos();
                this.renderTablaVentasRepuestos();

                document.getElementById('btnGuardar').disabled = false;
                document.getElementById('fileStatusMsg').textContent = `Estado: Archivo cargado (${file.name}). Cada cambio nuevo se guardará automáticamente aquí.`;
                document.getElementById('fileStatusMsg').style.color = "#27ae60";
            } catch (error) {
                if (error.name !== 'AbortError') console.error(error);
            }
        });

        // Guardar / actualizar manualmente el archivo Excel en disco
        document.getElementById('btnGuardar').addEventListener('click', async () => {
            await this.guardarAutomatico();
        });
    }
}

const appUI = new UIController();
