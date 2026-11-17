import unittest

from check_ios_aosl import aosl_imports, exported_symbols


class AoslSymbolsTest(unittest.TestCase):
    def test_detects_missing_strong_import_but_ignores_weak_and_other_libraries(self):
        imports = aosl_imports("""
_aosl_existing  (from aosl)
_aosl_data_ptr  (from aosl)
_optional  (weak-import) (from aosl)
_malloc  (from libSystem)
""")
        exports = exported_symbols("0000000000001000 T _aosl_existing\n")
        self.assertEqual(imports - exports, {"_aosl_data_ptr"})

    def test_accepts_a_companion_exporting_all_required_symbols(self):
        imports = aosl_imports("_aosl_data_ptr  (from aosl)\n")
        exports = exported_symbols("0000000000001000 T _aosl_data_ptr\n")
        self.assertFalse(imports - exports)


if __name__ == "__main__":
    unittest.main()
