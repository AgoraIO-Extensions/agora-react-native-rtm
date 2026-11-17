"""Reject device IPAs whose embedded AOSL cannot satisfy their framework imports."""
import argparse
from pathlib import Path
import subprocess
import tempfile
import zipfile


def aosl_imports(output):
    return {
        line.split()[0]
        for line in output.splitlines()
        if "(from aosl)" in line and "weak-import" not in line
    }


def exported_symbols(output):
    return {line.split()[-1] for line in output.splitlines() if line.split()}


def check(app):
    frameworks = app / "Frameworks"
    aosl = frameworks / "aosl.framework" / "aosl"
    exports = exported_symbols(subprocess.check_output(
        ["nm", "-arch", "arm64", "-gU", str(aosl)], text=True
    ))
    binaries = [app / app.stem] + [p / p.stem for p in frameworks.glob("*.framework")]
    failures = []
    for binary in binaries:
        imports = aosl_imports(subprocess.check_output(
            ["dyld_info", "-arch", "arm64", "-imports", str(binary)], text=True
        ))
        missing = sorted(imports - exports)
        if missing:
            failures.append(f"{binary.name}: {', '.join(missing)}")
    if failures:
        raise RuntimeError("Missing AOSL symbols:\n" + "\n".join(failures))
    print("Embedded AOSL satisfies all arm64 framework imports")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("ipa", type=Path)
    args = parser.parse_args()
    with tempfile.TemporaryDirectory(prefix="rtm-ipa-aosl-") as temporary:
        root = Path(temporary).resolve()
        with zipfile.ZipFile(args.ipa) as archive:
            for entry in archive.infolist():
                target = (root / entry.filename).resolve()
                if not target.is_relative_to(root):
                    raise ValueError("IPA contains a path outside its payload")
            archive.extractall(root)
        apps = list((root / "Payload").glob("*.app"))
        if len(apps) != 1:
            raise ValueError("Expected one application payload")
        check(apps[0])
