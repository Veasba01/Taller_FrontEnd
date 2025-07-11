// Script de prueba para verificar la conectividad con la API del dashboard
// Ejecutar en la consola del navegador para probar los endpoints

async function testDashboardAPI() {
  const baseURL = 'http://localhost:3000/dashboard';
  
  console.log('🔄 Iniciando pruebas de API Dashboard...\n');
  
  const tests = [
    {
      name: 'Ingresos del día',
      endpoint: `${baseURL}/ingresos-dia`,
      description: 'Obtiene los ingresos del día actual'
    },
    {
      name: 'Servicios pendientes del día',
      endpoint: `${baseURL}/servicios-pendientes-dia`,
      description: 'Obtiene los servicios pendientes del día'
    },
    {
      name: 'Ingresos por semana',
      endpoint: `${baseURL}/ingresos-por-semana`,
      description: 'Obtiene los ingresos de cada día de la semana'
    },
    {
      name: 'Resumen de la semana',
      endpoint: `${baseURL}/resumen-semana`,
      description: 'Obtiene el resumen completo de la semana'
    },
    {
      name: 'Estadísticas generales',
      endpoint: `${baseURL}/estadisticas-generales`,
      description: 'Obtiene estadísticas generales del taller'
    },
    {
      name: 'Servicios completados en la semana',
      endpoint: `${baseURL}/servicios-completados-semana`,
      description: 'Obtiene los servicios completados en la semana'
    },
    {
      name: 'Clientes atendidos en la semana',
      endpoint: `${baseURL}/clientes-atendidos-semana`,
      description: 'Obtiene los clientes atendidos en la semana'
    }
  ];

  const results = [];

  for (const test of tests) {
    console.log(`🧪 Probando: ${test.name}`);
    console.log(`📍 Endpoint: ${test.endpoint}`);
    console.log(`📝 Descripción: ${test.description}`);
    
    try {
      const startTime = Date.now();
      const response = await fetch(test.endpoint);
      const endTime = Date.now();
      const duration = endTime - startTime;
      
      if (response.ok) {
        const data = await response.json();
        console.log(`✅ Éxito (${duration}ms)`);
        console.log('📊 Datos recibidos:', data);
        results.push({
          test: test.name,
          status: 'success',
          duration,
          data
        });
      } else {
        console.log(`❌ Error HTTP ${response.status}: ${response.statusText}`);
        results.push({
          test: test.name,
          status: 'error',
          error: `HTTP ${response.status}: ${response.statusText}`
        });
      }
    } catch (error) {
      console.log(`❌ Error de conexión: ${error.message}`);
      results.push({
        test: test.name,
        status: 'error',
        error: error.message
      });
    }
    
    console.log(''); // Línea en blanco para separar tests
  }

  console.log('📋 Resumen de Pruebas:');
  console.log('='.repeat(50));
  
  const successful = results.filter(r => r.status === 'success').length;
  const failed = results.filter(r => r.status === 'error').length;
  
  console.log(`✅ Exitosas: ${successful}/${results.length}`);
  console.log(`❌ Fallidas: ${failed}/${results.length}`);
  
  if (failed > 0) {
    console.log('\n❌ Errores encontrados:');
    results.filter(r => r.status === 'error').forEach(r => {
      console.log(`  - ${r.test}: ${r.error}`);
    });
    
    console.log('\n🔧 Posibles soluciones:');
    console.log('1. Verificar que el servidor backend esté ejecutándose en http://localhost:3000');
    console.log('2. Verificar que el módulo Dashboard esté correctamente registrado en el backend');
    console.log('3. Verificar que la base de datos esté conectada y tenga datos');
    console.log('4. Verificar que los endpoints estén correctamente implementados');
  } else {
    console.log('🎉 ¡Todas las pruebas pasaron exitosamente!');
  }
  
  return results;
}

// Función auxiliar para probar un endpoint específico
async function testSingleEndpoint(endpointName) {
  const baseURL = 'http://localhost:3000/dashboard';
  const endpoint = `${baseURL}/${endpointName}`;
  
  console.log(`🧪 Probando endpoint: ${endpoint}`);
  
  try {
    const response = await fetch(endpoint);
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Éxito - Datos recibidos:', data);
      return data;
    } else {
      console.log(`❌ Error HTTP ${response.status}: ${response.statusText}`);
      return null;
    }
  } catch (error) {
    console.log(`❌ Error de conexión: ${error.message}`);
    return null;
  }
}

// Exportar funciones para uso en consola
window.testDashboardAPI = testDashboardAPI;
window.testSingleEndpoint = testSingleEndpoint;

console.log('🚀 Script de prueba cargado!');
console.log('📋 Funciones disponibles:');
console.log('  - testDashboardAPI(): Prueba todos los endpoints');
console.log('  - testSingleEndpoint("endpoint-name"): Prueba un endpoint específico');
console.log('');
console.log('💡 Ejemplos de uso:');
console.log('  testDashboardAPI()');
console.log('  testSingleEndpoint("ingresos-dia")');
console.log('  testSingleEndpoint("resumen-semana")');
