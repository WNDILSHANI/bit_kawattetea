package bit.project.server.seed;

import java.util.Hashtable;
import bit.project.server.util.seed.SeedClass;
import bit.project.server.util.seed.AbstractSeedClass;

@SeedClass
public class PackingstatusData extends AbstractSeedClass {

    public PackingstatusData(){
        addIdNameData(1, "Ready");
        addIdNameData(2, "N");
        addIdNameData(3, "R");
    }

}