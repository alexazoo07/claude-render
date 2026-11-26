# Spec of the El Mapa Hincha "collapse" shorts -> src/sh/<Mod>.tsx + ../elevenlabs/<tag>.json
# line = (who, voice_key, text_with_tags, [icons])   icon = dict(e=, w=, to=, fx=, n=)
import json, re, sys, os
V = {  # voice ids
	'neymar': 'BECjFqjKpX1jVslC0trK', 'thiago': 'SY4mLSy0fcJtGLQQ7CWp', 'zel': 'O4zHchxaTYyyLhoM3tNt', 'cleber': 'aNO16hzVi4q4QlUswT5o',
	'lopes': 'IdgdGfA5Cc6vhJIKIp5r', 'fabricio': 'rBBreftLiIVO1pgMzKel', 'chrisxg': 'K4Q6RaeeKiVh8QMF7EGz',
	'agustin': 'D09EpJbk4um1HKSpeTSc', 'luciano': 'O9HwbX9rbQPRXs00ekmd', 'juanchi': 'CzkPDbeaChfMe9viILX7', 'rafael_ar': 'Ne5lkCOR0C6ZYz9ulbrG',
	'ivan': '0tWO78FqrLTPX0qcRxQg', 'calbucoy': 'Lnsq2I8TzeNpjACvFQ3h',
	'orozco': 'MFczlrjgpEos5t8Rwlto', 'pablo_car': '64iVJ7QB471BXdqed0KJ', 'liam': 'TX3LPaxmHKxFdv7VOQHJ', 'andy': 'C2jL5LUEDZwtU8FfMBHA',
	'juanpablo': '0DRWFZS24qw1EtEs7073', 'andresm': 'BkyWsgIYNaGfKkrc5JgH', 'jose_pe': 'g2r3nlq655aINr7FvwvE',
	'esau': 'DZksvRcjbVkbnIwYVMEQ', 'javizame': 'RHlA3DlsD11QtFWhg5zs', 'godoy': 'y80tTbaJlZYGD1zrIR8w', 'marco_pe': 'evwyep6WFBR6cxuA8l40',
	'adam': 'pNInz6obpgDQGcFmaJgB', 'will': 'bIHbv24MWmeRgasZH58o', 'roger': 'CwhRBWXzGAHq8TQ4Fs17', 'harry': 'SOYHLrjzK2X1ezoPC6cr',
	'pablo_mx': 'qKiF0EEU7wtRm1G2mLMh', 'brian': 'nPczCjzI2devNBz1zQrb',
}
OWN = {}  # public owner ids for shared voices (filled from voices.json if present)
for f in ['/tmp/eo/voices2/voices.json', '/tmp/eo/voices/voices.json']:
	if os.path.exists(f):
		for s in json.load(open(f))['shared_es']['voices']: OWN.setdefault(s['voice_id'], s['public_owner_id'])
I = lambda e, w=None, **k: dict(e=e, **({'w': w} if w else {}), **k)

SHORTS = []
# ------------------------------------------------------------------ BRASIL
SHORTS.append(dict(mod='Short2', tag='cx2', comp='CX2', geo='br', a3='BRA', country='Brazil', heroFlag='br', hud='BRASIL RESTANTE:', music='m_happy',
	title='¿Y si Brasil se desmoronara?',
	hook="{type: 'count', from: 27, to: 19, label: 'BRASIL TIENE', text: ['8 QUISIERON IRSE', '¡DE VERDAD!']}",
	hero='neymar',
	intro=('h', 'neymar', '[orgulloso] ¡Olá! Soy Brasil, el país más grande de Sudamérica… [nervioso] ¿por qué me tiemblan los estados?', [I('⚽', 'brasil'), I('😰', 'tiemblan')]),
	fin=('h', 'neymar', '[suspira] Bueno… sigo siendo enorme. [preocupado] ¿Quién más se quiere ir?', [I('🌎', 'enorme'), I('❓', 'quien')]),
	finale=['¿UN NUEVO', 'BRASIL?', '¿QUIÉN SIGUE?', 'COMENTA ABAJO ↓'],
	regions=[
		dict(id='rs', states=['Rio Grande do Sul'], flag='x/riograndense', label='RIO GRANDE DO SUL', name='RIO GRANDE DO SUL', verb='SE INDEPENDIZA', verbCol='#4BE07A', pill='REPÚBLICA RIOGRANDENSE (1836-1845)', lines=[
			('r', 'thiago', '[orgulloso] ¡Bah, tchê! ¡Me voy con mi mate y mi churrasco! ¡República Riograndense!', [I('🧉', 'mate'), I('🍖', 'churrasco')]),
			('h', 'neymar', '[gritando] ¡¿Otra vez?! ¡Ya te escapaste casi diez años!', [I('😱', 'otra', fx='big')]),
			('r', 'thiago', '[burlón] Y lo volvería a hacer, ¡bah!', [I('😏', 'volveria')])]),
		dict(id='sc', states=['Santa Catarina'], flag='x/juliana', label='SANTA CATARINA', name='SANTA CATARINA', verb='TAMBIÉN SE VA', verbCol='#FFD23F', pill='REPÚBLICA JULIANA (1839)', lines=[
			('r', 'zel', '[emocionado] ¡Yo también! ¡Garibaldi me liberó en 1839! ¡República Juliana!', [I('🇮🇹', 'garibaldi'), I('⚔️', 'libero')]),
			('h', 'neymar', '[incrédulo] ¿Un italiano? ¡¿Me robó un estado un italiano?!', [I('🍝', 'italiano'), I('🤯', 'robo', fx='big')]),
			('r', 'zel', '[riendo] Duré cuatro meses, ¡pero qué meses!', [I('🎉', 'meses')])]),
		dict(id='ne', states=['Pernambuco', 'Paraíba', 'Rio Grande do Norte', 'Ceará'], flag='x/equador', label='NORDESTE', name='EL NORDESTE', verb='SE SEPARA', verbCol='#FF5A4D', pill='CONFEDERACIÓN DEL ECUADOR (1824)', lines=[
			('r', 'cleber', '[gritando] ¡Pernambuco, Ceará, Paraíba y Rio Grande do Norte! ¡Nos vamos juntos, oxente!', [I('🌴', 'pernambuco'), I('🤝', 'juntos')]),
			('h', 'neymar', '[desesperado] ¡Cuatro de golpe no! ¡Que me quedo sin playas!', [I('🏖️', 'playas', to='r'), I('💧', fx='rain', n=12)]),
			('r', 'cleber', '[orgulloso] Confederación del Ecuador, 1824. ¡Búscalo!', [I('📜', 'confederacion'), I('🔎', 'buscalo')])]),
		dict(id='ba', states=['Bahia'], flag='x/bahiense', label='BAHIA', name='BAHIA', verb='SE INDEPENDIZA', verbCol='#6EC6FF', pill='REPÚBLICA BAHIENSE (1837-1838)', lines=[
			('r', 'lopes', '[relajado] Bahia también se va, meu rei… República Bahiense, como en 1837.', [I('🥥', 'bahia'), I('👑', 'rei')]),
			('h', 'neymar', '[llorando] ¡Bahia no! ¡¿Quién me va a hacer el acarajé?!', [I('🍤', 'acaraje', to='r'), I('💧', fx='rain', n=10)]),
			('r', 'lopes', '[riendo] Tranquilo, solo duré cuatro meses.', [I('⏳', 'meses')])]),
		dict(id='ac', states=['Acre'], flag='x/acre', label='ACRE', name='ACRE', verb='SE INDEPENDIZA', verbCol='#4BE07A', pill='REPÚBLICA DE ACRE (1899)', joiner="{flag: 'bo', country: 'Bolivia', mood: 'angry', label: 'BOLIVIA'}", lines=[
			('r', 'fabricio', '[emocionado] ¡República de Acre! ¡Y mi primer presidente fue un español!', [I('🇪🇸', 'espanol'), I('🎩', 'presidente')]),
			('j', 'chrisxg', '[furioso] ¡Un momento! ¡Acre era mío hasta 1903!', [I('😡', 'momento', fx='big')]),
			('h', 'neymar', '[nervioso] Eh… te lo compré, ¿te acuerdas? ¡Tratado de Petrópolis!', [I('💰', 'compre'), I('📜', 'tratado')])]),
	]))
# ------------------------------------------------------------------ ARGENTINA
SHORTS.append(dict(mod='Short3', tag='cx3', comp='CX3', geo='ar', a3='ARG', country='Argentina', heroFlag='ar', hud='ARGENTINA RESTANTE:', music='m_tense',
	title='¿Y si Argentina se rompiera?',
	hook="{type: 'crack', text: ['ARGENTINA', '¿IRROMPIBLE?']}",
	hero='agustin',
	intro=('h', 'agustin', '[orgulloso] Che, soy el país de habla hispana más grande del mundo. ¡A mí no me rompe nadie!', [I('🏆', 'grande'), I('💪', 'nadie')]),
	fin=('h', 'agustin', '[llorando] Sin capital, sin cataratas y sin Patagonia… [suspira] ¿Quién sigue, che?', [I('💔', 'capital'), I('❓', 'quien')]),
	finale=['¿UNA NUEVA', 'ARGENTINA?', '¿QUIÉN SIGUE?', 'COMENTA ABAJO ↓'],
	regions=[
		dict(id='ba', states=['Buenos Aires', 'Ciudad de Buenos Aires'], flag='x/bsas', label='BUENOS AIRES', name='BUENOS AIRES', verb='SE INDEPENDIZA', verbCol='#6EC6FF', pill='ESTADO DE BUENOS AIRES (1852-1861)', lines=[
			('r', 'luciano', '[arrogante] Me voy, che. Tengo el puerto, la plata y el mejor asado. ¡No te necesito!', [I('⚓', 'puerto'), I('💰', 'plata'), I('🥩', 'asado')]),
			('h', 'agustin', '[gritando] ¡¿Buenos Aires?! ¡Si sos mi capital!', [I('😱', 'buenos', fx='big')]),
			('r', 'luciano', '[burlón] Ya lo hice nueve años, de 1852 a 1861. ¡Chau!', [I('📅', '1852'), I('👋', 'chau')])]),
		dict(id='er', states=['Entre Ríos', 'Corrientes'], flag='x/entrerios', label='ENTRE RÍOS', name='ENTRE RÍOS Y CORRIENTES', verb='SE VAN', verbCol='#FF9F2E', pill='REPÚBLICA DE ENTRE RÍOS (1820-1821)', lines=[
			('r', 'juanchi', '[orgulloso] ¡República de Entre Ríos! Ramírez nos hizo país en 1820.', [I('🐎', 'ramirez'), I('🏛️', 'pais')]),
			('h', 'agustin', '[desesperado] ¡Y encima te llevás Corrientes!', [I('🌊', 'corrientes', to='r')]),
			('r', 'juanchi', '[riendo] ¡Y el chamamé también, che!', [I('🪗', 'chamame')])]),
		dict(id='tu', states=['Tucumán', 'Catamarca', 'Santiago del Estero'], flag='x/tucuman', label='TUCUMÁN', name='EL NORTE', verb='SE SEPARA', verbCol='#FF5A4D', pill='REPÚBLICA DE TUCUMÁN (1820-1821)', lines=[
			('r', 'rafael_ar', '[emocionado] ¡Tucumán, Catamarca y Santiago del Estero! ¡República de Tucumán!', [I('🎉', 'republica')]),
			('h', 'agustin', '[indignado] ¡Pero si en Tucumán declaramos la independencia!', [I('📜', 'independencia')]),
			('r', 'rafael_ar', '[burlón] Justamente. ¡Ahora la declaro de vos!', [I('😏', 'justamente')])]),
		dict(id='mi', states=['Misiones'], flag='py', label='MISIONES', name='MISIONES', verb='PASA A PARAGUAY', verbCol='#FF5A4D', pill='OCUPADA POR PARAGUAY DESDE 1838', lines=[
			('r', 'ivan', '[alegre] ¡Misiones es mía! La ocupé en 1838, ¿te acordás?', [I('🌿', 'misiones'), I('📅', '1838')]),
			('h', 'agustin', '[furioso] ¡Las Cataratas del Iguazú no te las llevás!', [I('🌊', 'cataratas', to='r')]),
			('r', 'ivan', '[riendo] Ya me las llevé, ¡jajá!', [I('😂', 'ya')])]),
		dict(id='pa', states=['Neuquén', 'Río Negro', 'Chubut', 'Santa Cruz'], flag='x/araucania', label='PATAGONIA', name='LA PATAGONIA', verb='SE HACE REINO', verbCol='#FFD23F', pill='REINO DE ARAUCANÍA Y PATAGONIA (1860)', lines=[
			('r', 'calbucoy', '[solemne] Ahora soy un reino. Y mi rey… es un abogado francés.', [I('👑', 'reino'), I('🇫🇷', 'frances')]),
			('h', 'agustin', '[incrédulo] ¿Un francés? ¡¿Rey de la Patagonia?! ¡Esto es un chiste!', [I('🤯', 'rey', fx='big')]),
			('r', 'calbucoy', '[serio] Orélie-Antoine Primero, 1860. Totalmente real.', [I('🤴', 'orelie')])]),
	]))
# ------------------------------------------------------------------ COLOMBIA
SHORTS.append(dict(mod='Short4', tag='cx4', comp='CX4', geo='co', a3='COL', country='Colombia', heroFlag='co', hud='COLOMBIA RESTANTE:', music='m_happy',
	title='¿Y si Colombia se desmoronara?',
	hook="{type: 'quiz', q: '¿QUÉ PAÍS ES ESTE?', reveal: ['¡ES COLOMBIA!', 'EN 1900']}",
	hero='orozco',
	intro=('h', 'orozco', '[orgulloso] ¡Sí, señor! Soy Colombia… [nervioso] bueno, la Colombia de 1900. ¿Ven ese pedacito de arriba?', [I('☕', 'colombia'), I('👀', 'ven')]),
	fin=('h', 'orozco', '[suspira] Sin Panamá, sin costa y sin capital… [preocupado] ¿quién sigue, parce?', [I('💔', 'panama'), I('❓', 'quien')]),
	finale=['¿UNA NUEVA', 'COLOMBIA?', '¿QUIÉN SIGUE?', 'COMENTA ABAJO ↓'],
	regions=[
		dict(id='pan', states=['Panama'], flag='pa', label='PANAMÁ', name='PANAMÁ', verb='SE INDEPENDIZA', verbCol='#4BE07A', pill='INDEPENDENCIA DE PANAMÁ (1903)', joiner="{flag: 'us', country: 'United States of America', mood: 'smug', label: 'EE.UU.'}", lines=[
			('r', 'pablo_car', '[decidido] ¡Me voy, Colombia! Desde hoy, 3 de noviembre de 1903, soy Panamá.', [I('📅', 'noviembre'), I('🎉', 'panama')]),
			('j', 'liam', '[sonriente] Y yo te ayudo, amigo… a cambio de un pequeño canal.', [I('🤝', 'ayudo'), I('🚢', 'canal')]),
			('h', 'orozco', '[furioso] ¡¿Un canal?! ¡Eso es un robo, gringos!', [I('😡', 'robo', fx='big')])]),
		dict(id='car', states=['Bolívar', 'Atlántico', 'Sucre', 'Córdoba'], flag='x/cartagena', label='CARTAGENA', name='CARTAGENA', verb='SE INDEPENDIZA', verbCol='#FFD23F', pill='ESTADO LIBRE DE CARTAGENA (1811)', lines=[
			('r', 'andy', '[orgulloso] ¡Ajá, cachaco! Cartagena fue la primera en declararse libre, en 1811.', [I('🏰', 'cartagena'), I('🥇', 'primera')]),
			('h', 'orozco', '[gritando] ¡Pero te llevas la costa, las murallas y el vallenato!', [I('🏖️', 'costa', to='r'), I('🏰', 'murallas', to='r'), I('🪗', 'vallenato', to='r')]),
			('r', 'andy', '[riendo] ¡Y la arepa de huevo, mi llave!', [I('🥚', 'arepa')])]),
		dict(id='ant', states=['Antioquia'], flag='x/antioquia', label='ANTIOQUIA', name='ANTIOQUIA', verb='SE INDEPENDIZA', verbCol='#4BE07A', pill='ESTADO DE ANTIOQUIA (1813)', lines=[
			('r', 'juanpablo', '[emocionado] ¡Eh, ave María, pues! Antioquia también se independiza, como en 1813.', [I('⛰️', 'antioquia')]),
			('h', 'orozco', '[desesperado] ¡Antioquia no! ¡Me dejas sin café y sin bandeja paisa!', [I('☕', 'cafe', to='r'), I('🍛', 'bandeja', to='r')]),
			('r', 'juanpablo', '[burlón] Tranquilo, parcero, se lo vendo bien caritico.', [I('💸', 'vendo')])]),
		dict(id='cun', states=['Cundinamarca', 'Bogota'], flag='x/cundinamarca', label='CUNDINAMARCA', name='CUNDINAMARCA', verb='SE INDEPENDIZA', verbCol='#FF5A4D', pill='ESTADO LIBRE DE CUNDINAMARCA (1813)', lines=[
			('r', 'andresm', '[solemne] Sumercé, Cundinamarca es Estado Libre desde 1813. Y me llevo a Bogotá.', [I('🎩', 'sumerce'), I('🏙️', 'bogota', to='r')]),
			('h', 'orozco', '[llorando] ¡¿Mi capital?! ¡¿Y dónde me tomo el ajiaco ahora?!', [I('🍲', 'ajiaco'), I('💧', fx='rain', n=12)])]),
		dict(id='ama', states=['Amazonas'], flag='pe', label='LETICIA', name='AMAZONAS', verb='LO OCUPA PERÚ', verbCol='#FF5A4D', pill='CONFLICTO DE LETICIA (1932-1933)', lines=[
			('r', 'jose_pe', '[pícaro] Oye, Leticia me queda cerquita… ¡Me la quedo, causa!', [I('🌴', 'leticia'), I('👉', 'quedo')]),
			('h', 'orozco', '[furioso] ¡Ya lo intentaste en 1932 y lo tuviste que devolver!', [I('😤', 'intentaste', fx='big')]),
			('r', 'jose_pe', '[riendo] Bueno, por intentar no se pierde nada, ¿no?', [I('🤷', 'intentar')])]),
	]))
# ------------------------------------------------------------------ PERÚ
SHORTS.append(dict(mod='Short5', tag='cx5', comp='CX5', geo='pe', a3='PER', country='Peru', heroFlag='pe', hud='PERÚ RESTANTE:', music='m_tense',
	title='¿Y si Perú se partiera en pedazos?',
	hook="{type: 'news', head: 'ÚLTIMA HORA', text: 'PERÚ SE ESTÁ PARTIENDO EN PEDAZOS', ticker: 'REGIONES DECLARAN SU INDEPENDENCIA   ●   LIMA PIDE CALMA   ●   SE BUSCA CEVICHE DE EMERGENCIA'}",
	hero='jose_pe',
	intro=('h', 'jose_pe', '[asustado] ¡Causa, causa! ¿Es en serio? ¡¿Me estoy partiendo en vivo?!', [I('📺', 'vivo'), I('😱', 'causa')]),
	fin=('h', 'jose_pe', '[suspira] Bueno… al menos me queda Lima y el ceviche. [preocupado] ¿Quién sigue, causa?', [I('🐟', 'ceviche'), I('❓', 'quien')]),
	finale=['¿UN NUEVO', 'PERÚ?', '¿QUIÉN SIGUE?', 'COMENTA ABAJO ↓'],
	regions=[
		dict(id='tum', states=['Tumbes'], flag='ec', label='TUMBES', name='TUMBES', verb='LO RECLAMA ECUADOR', verbCol='#FFD23F', pill='ECUADOR LO RECLAMÓ HASTA 1998', lines=[
			('r', 'esau', '[alegre] ¡Ñaño! Tumbes siempre me gustó, ¿me lo das?', [I('🏖️', 'tumbes'), I('🙏', 'das')]),
			('h', 'jose_pe', '[gritando] ¡Ni hablar! ¡Eso lo cerramos en 1998!', [I('📜', '1998')]),
			('r', 'esau', '[decepcionado] Ya, ya… pero me llevo un cevichito.', [I('🐟', 'cevichito', to='r')])]),
		dict(id='lor', states=['Loreto'], flag='x/loreto', label='LORETO', name='LORETO', verb='SE DECLARA FEDERAL', verbCol='#4BE07A', pill='ESTADO FEDERAL DE LORETO (1896)', lines=[
			('r', 'javizame', '[emocionado] ¡Desde Iquitos, Estado Federal de Loreto! Como en 1896… ¡y en 1921!', [I('🛶', 'iquitos'), I('🌳', 'loreto')]),
			('h', 'jose_pe', '[desesperado] ¡Loreto es casi un tercio de mi territorio!', [I('🗺️', 'tercio')]),
			('r', 'javizame', '[burlón] Por eso mismo, ¡bye bye!', [I('👋', 'bye')])]),
		dict(id='tac', states=['Tacna'], flag='cl', label='TACNA', name='TACNA', verb='SE LA QUEDA CHILE', verbCol='#FF5A4D', pill='OCUPADA POR CHILE (1880-1929)', lines=[
			('r', 'godoy', '[pícaro] Oye, Tacna fue mía casi cincuenta años, po. ¡Me la vuelvo a llevar!', [I('📅', 'cincuenta'), I('🏃', 'llevar')]),
			('h', 'jose_pe', '[furioso] ¡Ni lo sueñes! ¡Tacna volvió a casa en 1929!', [I('😡', 'suenes', fx='big'), I('🏠', 'casa')]),
			('r', 'godoy', '[riendo] Ya, ya, era broma, po… ¿o no?', [I('😏', 'broma')])]),
		dict(id='sur', states=['Arequipa', 'Ayacucho', 'Cusco', 'Puno'], flag='x/sudperu', label='SUR DEL PERÚ', name='EL SUR', verb='SE INDEPENDIZA', verbCol='#FF9F2E', pill='ESTADO SUD-PERUANO (1836-1839)', lines=[
			('r', 'marco_pe', '[orgulloso] ¡Arequipa, Cusco, Puno y Ayacucho! ¡Somos el Estado Sud-Peruano otra vez!', [I('🏔️', 'arequipa'), I('🦙', 'cusco')]),
			('h', 'jose_pe', '[llorando] ¡¿Y Machu Picchu?! ¡¿Y el lago Titicaca?!', [I('🏛️', 'machu', to='r'), I('🌊', 'titicaca', to='r'), I('💧', fx='rain', n=12)]),
			('r', 'marco_pe', '[burlón] Todo nuestro, ¡como en 1836!', [I('🎉', 'nuestro')])]),
	]))
# ------------------------------------------------------------------ BOLIVIA (gain)
SHORTS.append(dict(mod='Short6', tag='cx6', comp='CX6', geo='bo', a3='BOL', country='Bolivia', heroFlag='bo', hud='BOLIVIA:', music='m_triumph', mode='gain',
	title='¿Y si Bolivia recuperara todo lo que perdió?',
	hook="{type: 'flash', text: ['ASÍ SERÍA', 'BOLIVIA'], sub: 'SI RECUPERARA TODO LO QUE PERDIÓ'}",
	hero='chrisxg',
	intro=('h', 'chrisxg', '[decidido] Ya está bien. Hoy recupero todo lo que me quitaron… ¡empezando por mi mar!', [I('💪', 'recupero'), I('🌊', 'mar')]),
	fin=('h', 'chrisxg', '[eufórico] ¡Ahora sí! ¡Bolivia gigante! [preocupado] ¿Y ahora qué hago con tanto mar?', [I('🎉', 'gigante'), I('🚤', 'hago')]),
	finale=['¿UNA NUEVA', 'BOLIVIA?', '¿QUIÉN SE QUEJA?', 'COMENTA ABAJO ↓'],
	regions=[
		dict(id='lit', states=['CHL:Antofagasta'], flag='cl', fill='bo', label='LITORAL', name='EL LITORAL', verb='VUELVE A BOLIVIA', verbCol='#4BE07A', pill='PERDIDO EN LA GUERRA DEL PACÍFICO (1879-1884)', lines=[
			('h', 'chrisxg', '[emocionado] ¡Mi mar! ¡Mi puerto de Antofagasta! ¡Vuelve a casa!', [I('🌊', 'mar'), I('⚓', 'puerto'), I('🏠', 'casa')]),
			('r', 'godoy', '[furioso] ¡Oye, no po! ¡Eso lo firmamos en 1904!', [I('😡', 'oye', fx='big'), I('📜', '1904')]),
			('h', 'chrisxg', '[feliz] Pues yo ahora firmo esto: ¡devuélvemelo!', [I('✍️', 'firmo')])]),
		dict(id='acr', states=['BRA:Acre'], flag='br', fill='bo', label='ACRE', name='ACRE', verb='VUELVE A BOLIVIA', verbCol='#4BE07A', pill='CEDIDO A BRASIL (1903)', lines=[
			('h', 'chrisxg', '[alegre] ¡Acre, hermano! ¡Tú también vuelves!', [I('🌳', 'acre')]),
			('r', 'neymar', '[nervioso] ¡Pero yo te pagué dos millones de libras!', [I('💰', 'pague'), I('💷', 'libras')]),
			('h', 'chrisxg', '[pícaro] Te los devuelvo… en cuotas.', [I('💸', 'devuelvo'), I('🗓️', 'cuotas')])]),
		dict(id='cha', states=['PRY:Boquerón', 'PRY:Alto Paraguay', 'PRY:Presidente Hayes'], flag='py', fill='bo', label='CHACO', name='EL CHACO', verb='VUELVE A BOLIVIA', verbCol='#4BE07A', pill='GUERRA DEL CHACO (1932-1935)', lines=[
			('r', 'ivan', '[furioso] ¡Ni se te ocurra! ¡El Chaco lo gané en la guerra!', [I('😤', 'ocurra', fx='big'), I('⚔️', 'guerra')]),
			('h', 'chrisxg', '[decidido] Y yo lo quiero de vuelta. ¡Es más de la mitad de tu país!', [I('🗺️', 'mitad')]),
			('r', 'ivan', '[desesperado] ¡Justamente por eso!', [I('😭', 'justamente')])]),
	]))
# ------------------------------------------------------------------ EE.UU.
SHORTS.append(dict(mod='Short7', tag='cx7', comp='CX7', geo='us', a3='USA', country='United States of America', heroFlag='us', hud='EE.UU. RESTANTE:', music='m_tense',
	title='¿Y si Estados Unidos se desmoronara?', start='[2050, 2010]',
	hook="{type: 'lineup', text: ['¡4 ESTADOS', 'QUIEREN IRSE DE EE.UU.!']}",
	hero='adam',
	intro=('h', 'adam', '[seguro] Soy Estados Unidos, la gran potencia mundial. Nadie se atrevería a… [sorprendido] ¿eh? ¿Qué hacen esos cuatro?', [I('🦅', 'potencia'), I('👀', 'cuatro')]),
	fin=('h', 'adam', '[asustado] ¡Sin California, sin Texas y sin el Sur! [preocupado] ¿Quién sigue? ¿Nueva York?', [I('🗽', 'nueva'), I('❓', 'quien')]),
	finale=['¿UNOS NUEVOS', 'EE.UU.?', '¿QUIÉN SIGUE?', 'COMENTA ABAJO ↓'],
	regions=[
		dict(id='ver', states=['Vermont'], flag='x/vermont', label='VERMONT', name='VERMONT', verb='SE INDEPENDIZA', verbCol='#4BE07A', pill='REPÚBLICA DE VERMONT (1777-1791)', lines=[
			('r', 'will', '[tranquilo] Vermont se va. Fui república catorce años, con mi propia moneda.', [I('🍁', 'vermont'), I('🪙', 'moneda')]),
			('h', 'adam', '[confundido] ¿Vermont? ¿Pero tú no eras solo… jarabe de arce?', [I('🥞', 'jarabe')]),
			('r', 'will', '[ofendido] ¡Oye! El mejor jarabe de arce del país, gracias.', [I('🍯', 'mejor')])]),
		dict(id='cal', states=['California'], flag='x/california', label='CALIFORNIA', name='CALIFORNIA', verb='SE INDEPENDIZA', verbCol='#FFD23F', pill='REPÚBLICA DE CALIFORNIA (1846)', lines=[
			('r', 'roger', '[relajado] Dude… California se independiza. Me llevo Hollywood, Silicon Valley y las playas.', [I('🎬', 'hollywood', to='r'), I('💻', 'silicon', to='r'), I('🏄', 'playas', to='r')]),
			('h', 'adam', '[gritando] ¡No! ¡Tu república duró veinticinco días!', [I('😱', 'no', fx='big'), I('📅', 'veinticinco')]),
			('r', 'roger', '[riendo] Pero qué veinticinco días, bro.', [I('😎', 'bro')])]),
		dict(id='tex', states=['Texas'], flag='x/texas', label='TEXAS', name='TEXAS', verb='SE INDEPENDIZA', verbCol='#FF5A4D', pill='REPÚBLICA DE TEXAS (1836-1845)', joiner="{flag: 'mx', country: 'Mexico', mood: 'angry', label: 'MÉXICO'}", lines=[
			('r', 'harry', '[orgulloso] ¡Yeehaw! ¡República de Texas otra vez! Como de 1836 a 1845.', [I('🤠', 'yeehaw'), I('🐄', 'texas')]),
			('j', 'pablo_mx', '[furioso] ¡Ah, no! Si Texas se va, ¡que vuelva conmigo, que era mío!', [I('😡', 'ah', fx='big')]),
			('h', 'adam', '[nervioso] Bueno… técnicamente sí era tuyo.', [I('😬', 'tecnicamente')])]),
		dict(id='sur', states=['South Carolina', 'Mississippi', 'Florida', 'Alabama', 'Georgia', 'Louisiana', 'Virginia', 'Arkansas', 'North Carolina', 'Tennessee'], flag='x/csa', label='EL SUR', name='EL SUR', verb='SE SEPARA', verbCol='#FF5A4D', pill='ESTADOS CONFEDERADOS (1861-1865)', lines=[
			('r', 'brian', '[desafiante] Y el Sur se separa. Como en 1861.', [I('⚔️', 'separa')]),
			('h', 'adam', '[serio] Eso ya terminó en guerra civil. Y la perdiste.', [I('🏳️', 'perdiste')]),
			('r', 'brian', '[nervioso] Eh… era solo una idea.', [I('😅', 'idea')])]),
	]))

def strip(t): return re.sub(r'\s*\[[^\]]*\]\s*', ' ', t).strip()
def js(x): return json.dumps(x, ensure_ascii=False)
def icons_ts(ic): return '[' + ', '.join('{' + ', '.join(f"{k}: {js(v)}" for k, v in i.items()) + '}' for i in ic) + ']'
def line_ts(l): return f"{{who: '{l[0]}', text: {js(strip(l[2]))}, icons: {icons_ts(l[3])}}}"
def build(S):
	jl = []
	def add(id_, l):
		d = dict(id=id_, voice=V[l[1]], text=l[2], stability=0.0, language='es')
		if V[l[1]] in OWN: d['owner'] = OWN[V[l[1]]]
		jl.append(d)
	add('intro', S['intro']); add('fin', S['fin'])
	regs = []
	for r in S['regions']:
		for k, l in enumerate(r['lines']): add(f"{r['id']}_{k}", l)
		extra = ''
		if 'joiner' in r: extra += f", joiner: {r['joiner']}"
		if 'fill' in r: extra += f", fill: '{r['fill']}'"
		regs.append(f"\t\t{{id: '{r['id']}', states: {js(r['states'])}, flag: '{r['flag']}', label: {js(r['label'])}, name: {js(r['name'])}, verb: {js(r['verb'])}, verbCol: '{r['verbCol']}', pill: {js(r['pill'])}{extra},\n\t\t\tlines: [{', '.join(line_ts(l) for l in r['lines'])}]}},")
	json.dump({'model': 'eleven_v4', 'lines': jl}, open(f"../elevenlabs/{S['tag']}.json", 'w'), ensure_ascii=False, indent=1)
	ts = f"""// {S['title']}  (generated by tools/shorts_spec.py)
import {{makeCollapse}} from './Collapse';
import G from './{S['geo']}.json';
import VO from './vo_{S['tag']}.json';
const S = makeCollapse({{
	geo: G as any, a3: '{S['a3']}', country: {js(S['country'])}, heroFlag: '{S['heroFlag']}', hud: {js(S['hud'])}, music: '{S['music']}', vo: VO as any, voPrefix: 'vo_{S['tag']}',{" mode: 'gain'," if S.get('mode') == 'gain' else ''}{f" start: {S['start']}," if S.get('start') else ''}
	hook: {S['hook']},
	intro: {line_ts(S['intro'])},
	fin: {line_ts(S['fin'])},
	finale: {js(S['finale'])} as any,
	regions: [
{chr(10).join(regs)}
	],
}});
export const SX = S;
export const {S['mod']}V = S.Video;
export const {S['mod']}_TOTAL = S.TOTAL;
"""
	open(f"src/sh/{S['mod']}.tsx", 'w').write(ts)
	if not os.path.exists(f"src/sh/vo_{S['tag']}.json"): json.dump({'dur': {}, 'words': {}}, open(f"src/sh/vo_{S['tag']}.json", 'w'))
	return len(jl)
if __name__ == '__main__':
	for S in SHORTS: print(S['tag'], build(S), 'lines')
