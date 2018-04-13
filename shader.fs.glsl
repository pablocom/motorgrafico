precision mediump float;

struct DirectionalLight
{
	vec3 direction;
	vec3 color;
};

varying vec2 fragTexCoord;
varying vec3 fragNormal;

uniform vec3 ambientLightIntensity;
uniform DirectionalLight sun;
uniform sampler2D sampler;

void main()
{
	vec3 surfaceNormal = normalize(fragNormal);
	vec3 normSunDir = normalize(sun.direction);
	vec4 texel = texture2D(sampler, fragTexCoord);

	vec3 specularLightIntensity = sun.color * max(dot(fragNormal, normSunDir), 0.0);

	vec3 diffuseLightIntensity = sun.color * max(dot(fragNormal, normSunDir), 0.0);

	vec3 lightIntensity = ambientLightIntensity + diffuseLightIntensity;



	gl_FragColor = vec4(texel.rgb * lightIntensity, texel.a);
}