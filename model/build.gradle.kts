val smithyVersion: String by project

buildscript {
    repositories { mavenLocal() }

    // Why does this have to be in here and not outside buildscript?
    val smithyGradlePluginVersion: String by project
    dependencies {
        classpath("software.amazon.smithy.rust.codegen:codegen-client:$smithyGradlePluginVersion")
    }
}

plugins { id("software.amazon.smithy") }

dependencies {
    implementation("software.amazon.smithy:smithy-aws-traits:$smithyVersion")
    implementation("software.amazon.smithy:smithy-model:$smithyVersion")
}

smithy { outputDirectory = buildDir.resolve("codegen") }

tasks {
    val srcDir = projectDir.resolve("../")
    val clientSdkCrateName: String by project
    val copyClientCrate =
            create<Copy>("copyClientCrate") {
                from("$buildDir/codegen/$clientSdkCrateName/rust-client-codegen")
                into("$srcDir/$clientSdkCrateName")
            }

    val generateWorkspace = create<Task>("generateWorkspace")

    getByName("assemble").dependsOn("smithyBuildJar")
    getByName("assemble").finalizedBy(copyClientCrate, generateWorkspace)
}
