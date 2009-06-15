
/*
 * Copyright 2006-2008 Appcelerator, Inc.
 * 
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *    http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License. 
 */

package org.appcelerator.agent;

import java.io.BufferedInputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.lang.instrument.ClassDefinition;
import java.lang.instrument.Instrumentation;

public class SimpleInstrumentor {
    static Instrumentation instrumentation;
    public static void redefine(Class clz, File file) {
        try {
            byte[] bytes = new byte[(int)file.length()];
            BufferedInputStream stream = new BufferedInputStream(new FileInputStream(file));
            int read = stream.read(bytes,0,(int)file.length());
            stream.close();
            if(read != file.length()) {
		throw new RuntimeException(new IOException("number of bytes read was: "+read+" when I expected "+file.length()+" in the SimpleInstrumentor"));
            }
            ClassDefinition[] classDefs = {
                new ClassDefinition(clz, bytes)
            };
            instrumentation.redefineClasses(classDefs);
        }
        catch (Exception e) {
            throw new RuntimeException(e);
        }
    }
    public static void premain(String args, Instrumentation instrument) {
        instrumentation = instrument;
    }
}
