package bit.project.server.seed;

import java.util.Hashtable;
import bit.project.server.util.seed.SeedClass;
import bit.project.server.util.seed.AbstractSeedClass;

@SeedClass
public class WitherlineData extends AbstractSeedClass {

    public WitherlineData(){
        addIdNameData(1, "Working");
        addIdNameData(2, "Resigned");
        addIdNameData(3, "Suspended");
    }

}